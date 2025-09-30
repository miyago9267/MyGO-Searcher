import { MongoRepository, FileRepository } from '../repositories'

/**
 * 人氣統計服務類
 */
export class PopularityService {
  private mongoRepo = new MongoRepository()
  private fileRepo = new FileRepository()

  /**
   * 人氣統計
   */
  async updatePopularity(params: {
    imageId?: string
    imageUrl?: string
    action: 'copy' | 'download'
  }): Promise<{
    success: boolean
    action: string
    imageId: string
    updated: boolean
    methods: string[]
    mongoUpdated: boolean
    localUpdated: boolean
  }> {
    const { imageId, imageUrl, action } = params

    let mongoUpdated = false
    let localUpdated = false
    const results: string[] = []

    // 方法 1: MongoDB 更新
    try {
      if (imageId !== undefined && imageId !== null) {
        mongoUpdated = await this.mongoRepo.updatePopularity(imageId, imageUrl)
        if (mongoUpdated) {
          results.push('mongodb')
        }
      }
    }
    catch (error) {
      console.warn('MongoDB update failed:', error)
    }

    try {
      if (imageId !== undefined && imageId !== null) {
        localUpdated = await this.fileRepo.updatePopularity(imageId)
        if (localUpdated) {
          results.push('local-file')
        }
      }
    }
    catch (error) {
      console.warn('Local file update failed:', error)
    }

    return {
      success: mongoUpdated || localUpdated,
      action,
      imageId: imageId || imageUrl || '',
      updated: mongoUpdated || localUpdated,
      methods: results,
      mongoUpdated,
      localUpdated,
    }
  }
}
