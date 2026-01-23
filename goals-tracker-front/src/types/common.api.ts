export interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, string>;
}

export interface ExtendedError extends Error {
  status: number;
  details?: Record<string, string>;
  type?: string;
}
