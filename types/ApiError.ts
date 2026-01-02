export class ApiError extends Error {
  status?: number;
  data?: unknown;
  cause?: unknown;

  constructor(
    message: string,
    status?: number,
    data?: unknown,
    cause?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.cause = cause;
  }
}
