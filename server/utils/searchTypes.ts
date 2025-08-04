export interface SearchResult {
	id: string;
	url: string;
	alt: string;
	author?: string;
	episode?: string;
	score: number;
}

export interface SearchParams {
	query: string;
	fuzzy: boolean;
	page: number;
	limit: number;
	order: string;
}

export interface SearchResponseItem {
	id: string;
	url: string;
	alt: string;
	author?: string;
	episode?: string;
}

export interface SearchResponse {
	data: SearchResponseItem[];
	meta: {
		query: string;
		fuzzy: boolean;
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

export interface ImageData {
	alt: string;
	file_name?: string;  // 兼容舊版本
	filename?: string;   // 新版本處理後的
	author?: string;
	episode?: string;
	tags?: string[];
}
