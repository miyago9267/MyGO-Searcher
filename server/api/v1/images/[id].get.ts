import { defineEventHandler, getRouterParam, createError } from 'h3'
import { MongoRepository } from '../../../repositories/mongoRepository'
import { PopularityService } from '../../../services/popularityService'
import { getJsonData } from '../../../utils/dataLoader'
import type { ImageData } from '../../../types'
import { createImageUrlResolver } from '../../../utils/imageUrlResolver'

/**
 * GET /api/v1/images/{id}
 * 獲取特定圖片詳情
 */
export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Image ID is required',
      })
    }

    let imageItem: ImageData | undefined
    try {
      const mongoImages = await new MongoRepository().getImages()
      imageItem = mongoImages.find(item => String(item.id) === id)
    }
    catch {
      const dataMapping: ImageData[] = await getJsonData()
      imageItem = dataMapping.find(item => String(item.id) === id)
    }

    if (!imageItem) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Image not found',
      })
    }

    await new PopularityService().updatePopularity({
      imageId: id,
      action: 'exact-search',
    })

    const resolveImageUrl = createImageUrlResolver(useRuntimeConfig(event).NUXT_IMG_BASE_URL)
    return {
      data: {
        id: imageItem.id,
        url: resolveImageUrl(imageItem),
        alt: imageItem.alt,
        author: imageItem.author,
        episode: imageItem.episode,
        filename: imageItem.filename,
      },
    }
  }
  catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch image details',
    })
  }
})
