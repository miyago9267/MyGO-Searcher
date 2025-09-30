import { defineEventHandler, readBody, createError } from 'h3'
import { PopularityService } from '../../../services/popularityService'

/**
 * POST /api/v1/images/popularity
 * 更新圖片人氣統計
 * Body:
 * - imageId: 圖片ID (必填)
 * - action: 'copy' | 'download' (必填) - 兩者加分相同
 * - imageUrl?: 圖片URL (用於備用識別)
 */
interface PopularityUpdateRequest {
  imageId?: string
  action?: 'copy' | 'download'
  imageUrl?: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<PopularityUpdateRequest>(event)
    const { imageId, action, imageUrl } = body

    // 驗證必要參數
    if (!action || !['copy', 'download'].includes(action)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid action. Must be "copy" or "download".',
      })
    }

    if ((imageId === undefined || imageId === null) && !imageUrl) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Either imageId or imageUrl is required.',
      })
    }

    // 使用人氣統計服務處理業務邏輯
    const popularityService = new PopularityService()
    const result = await popularityService.updatePopularity({
      imageId,
      imageUrl,
      action,
    })

    // 如果都失敗了，至少返回成功響應（避免影響用戶體驗）
    if (!result.success) {
      return {
        success: true,
        action,
        imageId: imageId || imageUrl,
        updated: false,
        method: 'none',
        note: 'Statistics could not be persisted',
      }
    }

    return result
  }
  catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update popularity statistics',
    })
  }
})
