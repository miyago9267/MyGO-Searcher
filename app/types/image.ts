// Image related types
export interface MatchInfo {
  text: string
  startIndex: number
  endIndex: number
  matchType: 'exact' | 'fuzzy' | 'variant'
}

export interface ImageItem {
  url: string
  alt: string
  id?: string | number
  author?: string
  episode?: string
  filename?: string
  tags?: string[]
  popularity?: number
  description?: string
  matches?: MatchInfo[]
}

export interface UseImagesOptions {
  initialQuery?: string
  pageSize?: number
  fuzzySearch?: boolean
  sortOrder?: string
}

// Re-export FilterOptions from filter.ts to maintain compatibility
export type { FilterOptions } from './filter'
