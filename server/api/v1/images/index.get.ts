import { getJsonData } from '../../../utils/dataLoader';
import { sortImages,  type SortOrder } from '../../../utils';
import { defineEventHandler, getQuery, createError } from 'h3';

const baseURL = useRuntimeConfig().NUXT_IMG_BASE_URL;

/**
 * GET /api/v1/images
 * 獲取所有圖片列表，支援分頁
 * 針對無限滾動優化的 API
 * 
 * Query parameters:
 * - page: 頁碼 (預設1，從1開始)
 * - limit: 每頁數量 (預設20，建議10-50之間)
 * - order: 排序方式 (預設按ID升序)
 *   - id: 按 ID 數字順序排序
 *   - random: 隨機排序
 *   - episode: 按集數排序 (mygo_x 優先於 mujica_x)
 *   - alphabetical: 按字典序排序 (依據 alt 屬性)
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const page = Math.max(parseInt(query.page as string) || 1, 1);
		const limit = Math.min(Math.max(parseInt(query.limit as string) || 20, 1), 100); // 限制最大100張
		const order = query.order as string || 'id';

		// 異步載入資料
		let data_mapping = await getJsonData();

		// 檢查數據是否可用
		if (!data_mapping || data_mapping.length === 0) {
			return {
				data: [],
				meta: {
					total: 0,
					page: 1,
					limit,
					totalPages: 0,
					hasNext: false,
					hasPrev: false
				}
			};
		}

		const allImages = data_mapping.map((item: any) => ({
			id: item.id,
			url: baseURL + item.filename,
			alt: item.alt,
			author: item.author,
			episode: item.episode,
			filename: item.filename,
			tags: item.tags || []
		}));

		const totalCount = allImages.length;
		const totalPages = Math.ceil(totalCount / limit);

		// 檢查頁碼是否超出範圍
		if (page > totalPages && totalPages > 0) {
			return {
				data: [],
				meta: {
					total: totalCount,
					page,
					limit,
					totalPages,
					hasNext: false,
					hasPrev: page > 1
				}
			};
		}

		const offset = (page - 1) * limit;
		const sortedImages = await sortImages(allImages, order as SortOrder);
		const paginatedImages = sortedImages.slice(offset, offset + limit);

		return {
			data: paginatedImages,
			meta: {
				total: totalCount,
				page,
				limit,
				totalPages,
				hasNext: page < totalPages,
				hasPrev: page > 1
			}
		};

	} catch (error: any) {
		console.error('Error in /api/v1/images:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch images library'
		});
	}
});
