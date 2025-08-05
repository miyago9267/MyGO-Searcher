import { defineEventHandler, getQuery, createError } from 'h3';
import { SearchService } from '../../../services/searchService';
import { customKeyMap } from '../../../utils/dataLoader';
import type { SearchParams } from '../../../types/search';

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
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    
    const searchParams: SearchParams = {
      query: query.q as string || query.keyword as string || '',
      fuzzy: query.fuzzy === 'true',
      page: parseInt(query.page as string) || 1,
      limit: parseInt(query.limit as string) || 20,
      order: query.order as string || 'id'
    };

    if (!searchParams.query.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Search query is required. Use "q" parameter.'
      });
    }

    const searchService = new SearchService(baseURL, customKeyMap);
    return await searchService.search(searchParams);

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
