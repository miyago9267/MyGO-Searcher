import { promises as fs } from 'fs'
import { join } from 'path'
import { getProcessedImageData } from '../utils'
import type { ImageData } from '../types'

export class FileRepository {
  private readonly IMAGE_MAP_PATH = join(process.cwd(), 'public', 'data', 'image_map.json')

  async getImages(): Promise<ImageData[]> {
    try {
      const data = JSON.parse(await fs.readFile(this.IMAGE_MAP_PATH, 'utf-8'))
      return await getProcessedImageData(data)
    }
    catch (error) {
      console.error('Failed to load from file repository:', error)
      throw error
    }
  }

  async getSearchData(): Promise<ImageData[]> {
    return await this.getImages()
  }

  async updatePopularity(imageId: string): Promise<boolean> {
    try {
      // 只更新原始圖片檔案（避免重複計分）
      const imageMapUpdated = await this.updateImageMapFile(imageId)

      return imageMapUpdated
    }
    catch (error) {
      console.error('File repository update failed:', error)
      return false
    }
  }

  async getPopularityStats(): Promise<Record<string, number>> {
    const stats: Record<string, number> = {}

    // 從原始圖片檔案獲取 popularity 數據
    try {
      const imageMapData = JSON.parse(await fs.readFile(this.IMAGE_MAP_PATH, 'utf-8'))
      for (const image of imageMapData) {
        if (image.id !== undefined && image.popularity) {
          stats[image.id.toString()] = image.popularity
        }
      }
    }
    catch (error) {
      console.warn('Failed to read image map file:', error)
    }

    return stats
  }

  private async updateImageMapFile(imageId: string): Promise<boolean> {
    try {
      const imageMapData = JSON.parse(await fs.readFile(this.IMAGE_MAP_PATH, 'utf-8'))

      const imageIndex = imageMapData.findIndex((img: ImageData) => {
        if (img.id !== undefined) {
          return img.id.toString() === imageId.toString()
        }
        return false
      })

      if (imageIndex === -1) {
        return false
      }

      if (!imageMapData[imageIndex].popularity) {
        imageMapData[imageIndex].popularity = 0
      }
      imageMapData[imageIndex].popularity += 1

      await fs.writeFile(this.IMAGE_MAP_PATH, JSON.stringify(imageMapData, null, 2))
      return true
    }
    catch (error) {
      console.error('Failed to update image_map.json:', error)
      return false
    }
  }

  private async ensureStatsFile(): Promise<void> {
    try {
      await fs.access(this.IMAGE_MAP_PATH)
    }
    catch {
      await fs.mkdir(join(process.cwd(), 'data'), { recursive: true })
      await fs.writeFile(this.IMAGE_MAP_PATH, JSON.stringify({}))
    }
  }
}
