export interface SearchResult {
  id: string
  url: string
  alt: string
  author?: string
  episode?: string
  score: number
  popularity?: number
}

export interface SearchParams {
  query: string
  fuzzy: boolean
  page: number
  limit: number
  order: string
}

export interface SearchResponseItem {
  id: string
  url: string
  alt: string
  author?: string
  episode?: string
}

export interface SearchResponse {
  data: SearchResponseItem[]
  meta: {
    query: string
    fuzzy: boolean
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ImageData {
  id?: number
  alt: string
  url?: string
  file_name?: string
  filename?: string
  author?: string
  episode?: string
  tags?: string[]
  popularity?: number
}
