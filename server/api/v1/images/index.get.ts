import { createError, defineEventHandler, getQuery } from 'h3'
import { ImageService } from '../../../services'
import type { SortOrder } from '../../../utils/sorting'

/** GET /api/v1/images - paginated image list. */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Math.max(Number.parseInt(query.page as string) || 1, 1)
    const limit = Math.min(Math.max(Number.parseInt(query.limit as string) || 20, 1), 100)
    const order = (query.order as string || 'id') as SortOrder
    const config = useRuntimeConfig(event)
    const imageService = new ImageService(config.NUXT_IMG_BASE_URL)

    return await imageService.getPaginatedImages({ page, limit, order })
  }
  catch (error: unknown) {
    console.error('Error in /api/v1/images:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch images library',
    })
  }
})
