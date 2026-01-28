export interface MatchInfo {
  text: string // 匹配的文字片段
  startIndex: number // 開始位置
  endIndex: number // 結束位置
  matchType: 'exact' | 'fuzzy' | 'variant' // 匹配類型
}

export interface SearchResult {
  id: string
  url: string
  alt: string
  author?: string
  episode?: string
  score: number
  popularity?: number
  description?: string
  matches?: MatchInfo[] // 匹配資訊
}

export interface SearchParams {
  query: string
  fuzzy: boolean
  page: number
  limit: number
  order: string
  semantic?: boolean
}

export interface SearchResponseItem {
  id: string
  url: string
  alt: string
  author?: string
  episode?: string
  matches?: MatchInfo[] // 匹配資訊
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
