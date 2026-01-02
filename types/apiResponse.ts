export type ApiResponse<T> = {
  data: T;
  total?: number;
  message?: string;
  error?: string;
};
