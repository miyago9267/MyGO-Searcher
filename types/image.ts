// Image related types
export interface ImageItem {
	url: string
	alt: string
	id?: string
	author?: string
	episode?: string
	filename?: string
	tags?: string[]
}

// Re-export FilterOptions from filter.ts to maintain compatibility
export type { FilterOptions } from './filter'
