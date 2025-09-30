// API response types
export interface ApiResponse<T = unknown> {
  data: T
  meta?: PaginationMeta | SearchMeta | RandomMeta
}

export interface ApiError {
  statusCode: number
  statusMessage: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface SearchMeta extends PaginationMeta {
  query: string
  fuzzy: boolean
}

export interface RandomMeta {
  count: number
  requested: number
}

// Query parameters
export interface SearchParams extends Record<string, string | number | boolean | undefined> {
  q: string
  fuzzy?: boolean
  page?: number
  limit?: number
  order?: string
}

export interface PaginationParams extends Record<string, string | number | boolean | undefined> {
  page?: number
  limit?: number
  order?: string
}

export interface RandomParams extends Record<string, string | number | boolean | undefined> {
  count?: number
}
