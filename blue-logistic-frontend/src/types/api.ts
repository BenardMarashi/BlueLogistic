export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiError {
  error?: string;
  errors?: Record<string, string>;
  message?: string;
  status?: number;
}
