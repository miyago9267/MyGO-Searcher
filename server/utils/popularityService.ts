import { getImagesCollection, isMongoConfigured } from './db';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * 人氣統計服務類
 */
export class PopularityService {
  private readonly STATS_FILE_PATH = join(process.cwd(), 'data', 'popularity-stats.json');
  private readonly IMAGE_MAP_PATH = join(process.cwd(), 'public', 'data', 'image_map.json');

  /**
   * 確保統計文件存在
   */
  private async ensureStatsFile(): Promise<void> {
    try {
      await fs.access(this.STATS_FILE_PATH);
    } catch {
      await fs.mkdir(join(process.cwd(), 'data'), { recursive: true });
      await fs.writeFile(this.STATS_FILE_PATH, JSON.stringify({}));
    }
  }

  /**
   * 更新原始圖片資料檔案的人氣值
   */
  async updateImageMapFile(imageId: string): Promise<boolean> {
    try {
      const imageMapData = JSON.parse(await fs.readFile(this.IMAGE_MAP_PATH, 'utf-8'));
      
      const imageIndex = imageMapData.findIndex((img: any) => 
        img.id.toString() === imageId.toString()
      );
      
      if (imageIndex === -1) {
        console.warn(`Image with id ${imageId} not found in image_map.json`);
        return false;
      }
      
      if (!imageMapData[imageIndex].popularity) {
        imageMapData[imageIndex].popularity = 0;
      }
      imageMapData[imageIndex].popularity += 1;
      
      await fs.writeFile(this.IMAGE_MAP_PATH, JSON.stringify(imageMapData, null, 2));
      return true;
    } catch (error) {
      console.error('Failed to update image_map.json:', error);
      return false;
    }
  }

  /**
   * 更新本地統計檔案
   */
  async updateLocalStats(imageId: string): Promise<boolean> {
    try {
      await this.ensureStatsFile();
      
      const statsData = JSON.parse(await fs.readFile(this.STATS_FILE_PATH, 'utf-8'));
      
      if (!statsData[imageId]) {
        statsData[imageId] = { popularity: 0 };
      }
      
      statsData[imageId].popularity += 1;
      
      await fs.writeFile(this.STATS_FILE_PATH, JSON.stringify(statsData, null, 2));
      return true;
    } catch (error) {
      console.error('Failed to update local stats:', error);
      return false;
    }
  }

  /**
   * 更新 MongoDB 中的人氣統計
   */
  async updateMongoStats(imageId: string, imageUrl?: string): Promise<boolean> {
    if (!isMongoConfigured()) {
      return false;
    }

    try {
      const collection = await getImagesCollection();
      
      let query: any = {};
      if (imageId !== undefined && imageId !== null) {
        const numericId = parseInt(imageId);
        if (!isNaN(numericId)) {
          query = { id: numericId };
        } else {
          query = { _id: imageId };
        }
      } else if (imageUrl) {
        query = { url: imageUrl };
      }
      
      const updateOperation = {
        $inc: { popularity: 1 }
      };

      const result = await collection.updateOne(query, updateOperation);
      
      if (result.matchedCount === 0) {
        console.warn(`No image found in MongoDB for ${imageId !== undefined && imageId !== null ? 'ID' : 'URL'}: ${imageId !== undefined && imageId !== null ? imageId : imageUrl}`);
        return false;
      }

      return result.modifiedCount > 0;
    } catch (error) {
      console.error('MongoDB update failed:', error);
      return false;
    }
  }

  /**
   * 更新人氣統計（多層級備份策略）
   */
  async updatePopularity(params: {
    imageId?: string;
    imageUrl?: string;
    action: 'copy' | 'download';
  }): Promise<{
    success: boolean;
    action: string;
    imageId: string;
    updated: boolean;
    methods: string[];
    mongoUpdated: boolean;
    localUpdated: boolean;
  }> {
    const { imageId, imageUrl, action } = params;
    
    let mongoUpdated = false;
    let localUpdated = false;
    const results: string[] = [];

    // 方法 1: MongoDB 更新
    if (isMongoConfigured() && (imageId !== undefined && imageId !== null)) {
      mongoUpdated = await this.updateMongoStats(imageId, imageUrl);
      if (mongoUpdated) {
        results.push('mongodb');
      }
    }

    // 方法 2: 原始圖片資料檔案更新
    if (imageId !== undefined && imageId !== null) {
      const imageMapUpdated = await this.updateImageMapFile(imageId);
      if (imageMapUpdated) {
        localUpdated = true;
        results.push('image-map-file');
        
        // 同時更新備份統計檔案
        const statsUpdated = await this.updateLocalStats(imageId);
        if (statsUpdated) {
          results.push('backup-stats');
        }
      }
    }

    // 方法 3: 本地統計檔案備份
    if (!localUpdated) {
      const statsUpdated = await this.updateLocalStats(imageId || imageUrl || '');
      if (statsUpdated) {
        localUpdated = true;
        results.push('local-stats-file');
      }
    }

    return {
      success: mongoUpdated || localUpdated,
      action,
      imageId: imageId || imageUrl || '',
      updated: mongoUpdated || localUpdated,
      methods: results,
      mongoUpdated,
      localUpdated
    };
  }
}
