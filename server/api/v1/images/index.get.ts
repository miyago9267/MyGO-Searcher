import { defineEventHandler, getQuery, createError } from 'h3';
import { ImageService } from '../../../services/imageService';
import type { SortOrder } from '../../../utils/sorting';

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
 *   - popularity: 按人氣排序 (最熱門的在前面)
 */
export default defineEventHandler(async (event) => {
	try {
		// 解析查詢參數
		const query = getQuery(event);
		const page = Math.max(parseInt(query.page as string) || 1, 1);
		const limit = Math.min(Math.max(parseInt(query.limit as string) || 20, 1), 100);
		const order = (query.order as string || 'id') as SortOrder;

		// 使用圖片服務處理業務邏輯
		const imageService = new ImageService(baseURL);
		const result = await imageService.getPaginatedImages({
			page,
			limit,
			order
		});

		return result;

	} catch (error: any) {
		console.error('Error in /api/v1/images:', error);
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch images library'
		});
	}
});
