// API response types
export interface ImageItem {
  id: string
  url: string
  alt: string
  author?: string
  episode?: string
  filename?: string
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

export interface ApiResponse<T = ImageItem[]> {
  data: T
  meta?: PaginationMeta | SearchMeta | RandomMeta
}

export interface ApiError {
  statusCode: number
  statusMessage: string
}

// Query parameters
export interface SearchParams extends Record<string, string | number | boolean | undefined> {
  q: string
  fuzzy?: boolean
  page?: number
  limit?: number
}

export interface PaginationParams extends Record<string, string | number | boolean | undefined> {
  page?: number
  limit?: number
}

export interface RandomParams extends Record<string, string | number | boolean | undefined> {
  count?: number
}
