// Image related types
export interface ImageItem {
	url: string
	alt: string
	id?: string
	author?: string
	episode?: string
	filename?: string
	tags?: string[]
	popularity?: number
	/** 儲存層物件鍵（遷移註冊表寫入）。設了就用它定址，與 episode 分類無關 */
	key?: string
	/** 定址路徑（key 優先，否則由 episode 推導）。只供組 URL，不進 API 回應 */
	storagePath?: string
}

// Re-export FilterOptions from filter.ts to maintain compatibility
export type { FilterOptions } from './filter'
