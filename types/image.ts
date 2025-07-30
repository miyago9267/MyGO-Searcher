// Image related types
export interface ImageItem {
	url: string
	alt: string
	id?: string
	author?: string
	episode?: string
	filename?: string
}

// Filter options for images
export interface FilterOptions {
  MyGO集數: string[]
  AveMujica集數: string[]
  MyGO人物: string[]
}
