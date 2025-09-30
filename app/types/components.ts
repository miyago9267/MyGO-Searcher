// Component props and interfaces
// Re-export filter options from image types
import type { FilterOptions } from './image'

export interface UseImagesOptions {
  initialQuery?: string
  pageSize?: number
  fuzzySearch?: boolean
  sortOrder?: string
}

// Component emits
export interface SearchBarEmits {
  (event: 'update:search' | 'search', value: string): void
}

export interface FilterEmits {
  (event: 'update:filter', value: FilterOptions): void
}
