import { getJsonData } from '../../../utils/dataLoader'
import { defineEventHandler, getRouterParam, createError } from 'h3'
import type { ImageData } from '../../../types'

const baseURL = ''

/**
 * GET /api/v1/images/{id}
 * 獲取特定圖片詳情
 */
export default defineEventHandler(async (event) => {
  try {
    const dataMapping: ImageData[] = await getJsonData()
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Image ID is required',
      })
    }

    // 查找圖片 (通過file_name去除副檔名比對ID)
    const imageItem = dataMapping.find(item => item.id === Number(id))

    if (!imageItem) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Image not found',
      })
    }

    return {
      data: {
        id: imageItem.id,
        url: baseURL + imageItem.filename,
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
