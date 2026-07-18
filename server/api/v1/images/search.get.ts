import { createError, defineEventHandler, getQuery } from 'h3'
import { SearchService } from '../../../services'
import type { SearchParams } from '../../../types'
import { customKeyMap } from '../../../utils/dataLoader'
import { createImageUrlResolver } from '../../../utils/imageUrlResolver'

/** GET /api/v1/images/search - metadata and optional semantic search. */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const params: SearchParams = {
      query: (query.q as string) || (query.keyword as string) || '',
      fuzzy: query.fuzzy === 'true' || query.fuzzy === true,
      page: Math.max(Number.parseInt(query.page as string) || 1, 1),
      limit: Math.min(Math.max(Number.parseInt(query.limit as string) || 20, 1), 100),
      order: (query.order as string) || 'id',
      semantic: query.semantic === 'true' || query.semantic === true,
    }

    if (!params.query.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Search query is required' })
    }

    const config = useRuntimeConfig(event)
    const searchService = new SearchService({
      customKeyMap,
      resolveImageUrl: createImageUrlResolver(config.NUXT_IMG_BASE_URL),
    })

    return await searchService.search(params)
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    console.error('Error in /api/v1/images/search:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to search images' })
  }
})
