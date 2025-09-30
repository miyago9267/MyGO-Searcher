import { sortImages, type SortOrder } from '../utils/sorting'
import { MongoRepository } from '../repositories/mongoRepository'
import { FileRepository } from '../repositories/fileRepository'

/**
 * 圖片服務類，處理所有圖片相關的業務邏輯
 */
export class ImageService {
  private mongoRepo = new MongoRepository()
  private fileRepo = new FileRepository()
  private baseURL: string

  constructor(baseURL?: string) {
    this.baseURL = baseURL || ''
  }

  /**
   * 獲取分頁圖片列表
   */
  async getPaginatedImages(params: {
    page: number
    limit: number
    order: SortOrder
  }): Promise<{
    data: any[]
    meta: {
      total: number
      page: number
      limit: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> {
    const { page, limit, order } = params

    // 獲取所有圖片
    let allImages = await this.getAllImages()

    if (allImages.length === 0) {
      return {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      }
    }

    // 如果是人氣排序，獲取最新的人氣統計數據
    if (order === 'popularity') {
      const popularityStats = await this.getPopularityStats()
      allImages = allImages.map(image => ({
        ...image,
        popularity: popularityStats[image.id?.toString()] || image.popularity || 0,
      }))
    }

    const totalCount = allImages.length
    const totalPages = Math.ceil(totalCount / limit)

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
          hasPrev: page > 1,
        },
      }
    }

    const offset = (page - 1) * limit
    const sortedImages = await sortImages(allImages, order)
    const paginatedImages = sortedImages.slice(offset, offset + limit)

    return {
      data: paginatedImages,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }
  }

  /**
   * 獲取所有圖片並轉換格式
   */
  private async getAllImages(): Promise<any[]> {
    try {
      // 優先從 MongoDB 獲取
      const mongoImages = await this.mongoRepo.getImages()
      return mongoImages.map((item: any) => ({
        id: item.id,
        url: this.baseURL + item.filename,
        alt: item.alt,
        author: item.author,
        episode: item.episode,
        filename: item.filename,
        tags: item.tags || [],
        popularity: item.popularity || 0,
      }))
    }
    catch {
      // 失敗則使用本地文件
      const fileImages = await this.fileRepo.getImages()
      return fileImages.map((item: any) => ({
        id: item.id,
        url: this.baseURL + item.filename,
        alt: item.alt,
        author: item.author,
        episode: item.episode,
        filename: item.filename,
        tags: item.tags || [],
        popularity: item.popularity || 0,
      }))
    }
  }

  /**
   * 獲取人氣統計數據
   */
  private async getPopularityStats(): Promise<Record<string, number>> {
    try {
      return await this.mongoRepo.getPopularityStats()
    }
    catch {
      return await this.fileRepo.getPopularityStats()
    }
  }
}
