import { defineEventHandler, getQuery, createError } from 'h3'
import { SearchService } from '../../../services'
import type { SearchParams } from '../../../types'

const baseURL = useRuntimeConfig().NUXT_IMG_BASE_URL
const customKeyMap = {} // 可以從設定檔載入自定義關鍵字映射

/**
 * GET /api/v1/images/search
 * 搜尋圖片,支援模糊搜尋和繁簡互搜
 *
 * Query parameters:
 * - q: 搜尋關鍵字
 * - fuzzy: 是否啟用模糊搜尋 (預設 false)
 * - page: 頁碼 (預設 1)
 * - limit: 每頁數量 (預設 20)
 * - order: 排序方式 (預設 id)
 */
export default defineEventHandler(async (event) => {
  try {
    // 解析查詢參數
    const query = getQuery(event)
    const searchQuery = (query.q as string) || ''
    const fuzzy = query.fuzzy === 'true' || query.fuzzy === true
    const page = Math.max(parseInt(query.page as string) || 1, 1)
    const limit = Math.min(Math.max(parseInt(query.limit as string) || 20, 1), 100)
    const order = (query.order as string) || 'id'

    // 如果沒有搜尋關鍵字,返回錯誤
    if (!searchQuery.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Search query is required',
      })
    }

    // 使用搜尋服務
    const searchService = new SearchService(baseURL, customKeyMap)
    const params: SearchParams = {
      query: searchQuery,
      fuzzy,
      page,
      limit,
      order,
      semantic: query.semantic === 'true' || query.semantic === true,
    }

    const result = await searchService.search(params)

    return result
  }
  catch (error: unknown) {
    console.error('Error in /api/v1/images/search:', error)

    // 如果已經是 H3 錯誤,直接拋出
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search images',
    })
  }
})
