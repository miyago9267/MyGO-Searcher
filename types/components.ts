// Component props and interfaces
export interface UseImagesOptions {
  initialQuery?: string
  initialImages?: ImageItem[]
  initialTotalCount?: number
  initialHasMore?: boolean
  pageSize?: number
  fuzzySearch?: boolean
  sortOrder?: string
}

// Component emits
export interface SearchBarEmits {
  (event: 'update:search', value: string): void
  (event: 'search', value: string): void
}

export interface FilterEmits {
  (event: 'update:filter', value: FilterOptions): void
}

// Re-export filter options from image types
import type { FilterOptions } from './image'
import type { ImageItem } from './image'
