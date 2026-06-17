export class PaginationMeta {
  total!: number;
  page!: number;
  limit!: number;
  totalPages!: number;
}
export class PaginatedResult<T> {
  data!: T[];
  pagination!: PaginationMeta;
}
