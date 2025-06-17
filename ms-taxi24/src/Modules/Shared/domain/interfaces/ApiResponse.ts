export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    pagination?: PaginationMeta;
  };
}

export type GenericResponse<T> = ApiResponse<T>; 