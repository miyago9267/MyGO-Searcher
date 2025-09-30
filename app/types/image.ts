// Image related types
export interface ImageItem {
  url: string
  alt: string
  id?: string | number
  author?: string
  episode?: string
  filename?: string
  tags?: string[]
  popularity?: number
}

// Re-export FilterOptions from filter.ts to maintain compatibility
export type { FilterOptions } from './filter'
