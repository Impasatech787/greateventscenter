import { ApiError } from "@/types/ApiError";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

type RefreshResponse = {
  data: {
    authToken: string;
    refreshToken: string; // if backend rotates refresh tokens
    expires: string | number;
  };
};

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

const ACCESS_TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const EXPIRES_AT_KEY = "expiresIn";

const API_BASE_URL = "/api";
const REFRESH_ENDPOINT = "/auth/refresh";
const LOGIN_PATH = "/signin";

const EXPIRY_SKEW_MS = 30_000;

function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setTokens(accessToken: string, refreshToken?: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
}

function extractApiErrorMessage(data: any): string | undefined {
  if (!data) return undefined;
  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;

  if (Array.isArray(data.errors) && data.errors[0]?.message) {
    return data.errors[0].message;
  }

  return undefined;
}

function toApiError(err: unknown): ApiError {
  if (!axios.isAxiosError(err)) {
    return new ApiError(
      err instanceof Error ? err.message : "Unexpected error",
      undefined,
      undefined,
      err,
    );
  }

  const status = err.response?.status;
  const data = err.response?.data;

  const message =
    extractApiErrorMessage(data) ||
    err.message ||
    (status ? `Request failed with status ${status}` : "Request failed");

  return new ApiError(message, status, data, err);
}

/**
 * Normalize various "expires" formats to epoch milliseconds.
 * Supports:
 * - ISO string date
 * - epoch ms number
 * - epoch seconds number (heuristic)
 */
function normalizeExpiresToMs(expires: string | number): number {
  if (typeof expires === "string") {
    const ms = Date.parse(expires);
    return Number.isFinite(ms) ? ms : 0;
  }
  // number
  if (expires < 10_000_000_000) {
    // likely seconds
    return expires * 1000;
  }
  return expires; // ms
}
function setExpiresAt(expires: string | number): void {
  const ms = normalizeExpiresToMs(expires);
  if (ms > 0) localStorage.setItem(EXPIRES_AT_KEY, String(ms));
}

function getExpiresAt(): number | null {
  const v = localStorage.getItem(EXPIRES_AT_KEY);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function isAccessTokenExpiredOrNear(): boolean {
  const expiresAt = getExpiresAt();
  if (!expiresAt) return false; // if you don't have expiry, fallback to 401-based refresh
  return Date.now() + EXPIRY_SKEW_MS >= expiresAt;
}

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // important if refresh token is in HttpOnly cookie
});

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ---- Request interceptor: attach access token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Refresh queue state
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

function processQueue(error: unknown, token?: string) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  if (!accessToken) {
    throw new Error("Missing access token");
  }
  if (!refreshToken) {
    throw new Error("Missing Refresh token");
  }
  const res = await refreshClient.post<RefreshResponse>(REFRESH_ENDPOINT, {
    accessToken,
    refreshToken,
  });

  const newAccessToken = res.data.data.authToken;
  const newRefreshToken = res.data.data.refreshToken; // optional rotation
  setTokens(newAccessToken, newRefreshToken);
  setExpiresAt(res.data.data.expires);

  return newAccessToken;
}

/**
 * Extend Axios config with our retry flag
 */
type RetryAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// ---- Request interceptor: proactive refresh + attach token
apiClient.interceptors.request.use(async (config: RetryAxiosRequestConfig) => {
  // If token is near expiry, refresh before sending request
  const token = getAccessToken();

  // No token: just continue (maybe public endpoint)
  if (!token) return config;

  if (isAccessTokenExpiredOrNear() && !config._retry) {
    // Prevent infinite loops: mark as "using refresh path"
    // (this flag is also used in response interceptor)
    config._retry = true;

    if (isRefreshing) {
      // wait for in-flight refresh
      const newToken = await new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
      config.headers.authorization = `Bearer ${newToken}`;
      return config;
    }

    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      config.headers.authorization = `Bearer ${newToken}`;
      return config;
    } catch (err) {
      processQueue(err);
      clearTokens();
      if (typeof window !== "undefined") window.location.href = LOGIN_PATH;
      throw err;
    } finally {
      isRefreshing = false;
    }
  }

  // Attach current token
  config.headers.authorization = `Bearer ${token}`;
  return config;
});

// ---- Response interceptor: refresh on 401 and retry
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetryAxiosRequestConfig | undefined;

    // If we don't have the original request config, just reject
    if (!originalRequest) return Promise.reject(toApiError(error));

    // Only handle 401 once per request
    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(toApiError(error));
    }

    originalRequest._retry = true;

    // If a refresh is already running, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject: (e) => reject(toApiError(e)),
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();

      // Update default header for future requests
      apiClient.defaults.headers.common.authorization = `Bearer ${newToken}`;

      // Resolve queued requests
      processQueue(null, newToken);

      // Retry the original request
      originalRequest.headers.authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr);

      // Clear auth and optionally redirect
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = LOGIN_PATH;
      }

      return Promise.reject(toApiError(refreshErr));
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
