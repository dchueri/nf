export class ResponseDto<T> {
  data: T;
  message: string;
}

export class PaginatedResponseDto<T> {
  docs: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}