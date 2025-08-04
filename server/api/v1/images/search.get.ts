import { 
	getJsonData, 
	customKeyMap, 
	sortImages, 
	SearchEngine,
	type SortOrder,
	type SearchParams,
	type SearchResponse,
	type SearchResponseItem
} from '../../../utils';
import { defineEventHandler, getQuery, createError } from 'h3';

const baseURL = useRuntimeConfig().NUXT_IMG_BASE_URL;

/**
 * GET /api/v1/images/search
 * 搜尋圖片
 * Query parameters:
 * - q: 搜尋關鍵字 (必填)
 * - fuzzy: 是否啟用模糊搜尋 (true/false, 預設false)
 * - page: 頁碼 (預設1)
 * - limit: 每頁數量 (預設20)
 * - order: 排序方式 (預設按ID升序)
 *   - id: 按 ID 數字順序排序
 *   - random: 隨機排序
 *   - episode: 按集數排序 (mygo_x 優先於 mujica_x)
 *   - alphabetical: 按字典序排序 (依據 alt 屬性)
 */
export default defineEventHandler(async (event): Promise<SearchResponse> => {
	try {
		const query = getQuery(event);
		
		// 解析搜索參數
		const searchParams: SearchParams = {
			query: query.q as string || query.keyword as string || '',
			fuzzy: query.fuzzy === 'true',
			page: parseInt(query.page as string) || 1,
			limit: parseInt(query.limit as string) || 20,
			order: query.order as string || 'id'
		};

		// 驗證必要參數
		if (!searchParams.query.trim()) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Search query is required. Use "q" parameter.'
			});
		}

		// 載入數據
		const data = await getJsonData();
		
		// 初始化搜索引擎
		const searchEngine = new SearchEngine(baseURL, customKeyMap);
		
		// 執行搜索
		const searchResults = await searchEngine.searchInData(
			data, 
			searchParams.query, 
			searchParams.fuzzy
		);

		// 排序結果
		const sortedResults = await sortImages(searchResults, searchParams.order as SortOrder);

		// 分頁處理
		const totalCount = sortedResults.length;
		const totalPages = Math.ceil(totalCount / searchParams.limit);
		const offset = (searchParams.page - 1) * searchParams.limit;
		const paginatedResults = sortedResults.slice(offset, offset + searchParams.limit);

		// 構建響應
		const response: SearchResponse = {
			data: paginatedResults.map((item): SearchResponseItem => ({
				id: item.id!,  // 在 SearchEngine 中已確保 id 存在
				url: item.url,
				alt: item.alt,
				author: item.author,
				episode: item.episode
			})),
			meta: {
				query: searchParams.query,
				fuzzy: searchParams.fuzzy,
				total: totalCount,
				page: searchParams.page,
				limit: searchParams.limit,
				totalPages,
				hasNext: searchParams.page < totalPages,
				hasPrev: searchParams.page > 1
			}
		};

		return response;

	} catch (error: any) {
		if (error.statusCode) {
			throw error;
		}
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to search images'
		});
	}
});
