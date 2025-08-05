import { getImagesCollection, isMongoConfigured } from '../config/database';
import { getProcessedImageData } from '../utils/dataProcessing';

export class MongoRepository {
  async getImages() {
    if (!isMongoConfigured()) {
      throw new Error('MongoDB not configured');
    }
    
    const collection = await getImagesCollection();
    const rawData = await collection.find({}).toArray();
    
    // 使用 getProcessedImageData 處理原始資料
    const processedData = await getProcessedImageData(rawData);
    
    return processedData.map((item: any) => ({
      id: item.id,
      url: item.url,
      alt: item.alt,
      author: item.author,
      episode: item.episode,
      filename: item.filename,
      tags: item.tags || [],
      popularity: item.popularity || 0
    }));
  }

  async updatePopularity(imageId?: string, imageUrl?: string): Promise<boolean> {
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
      
      const result = await collection.updateOne(query, {
        $inc: { popularity: 1 }
      });
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('MongoDB update failed:', error);
      return false;
    }
  }

  async getPopularityStats(): Promise<Record<string, number>> {
    if (!isMongoConfigured()) {
      throw new Error('MongoDB not configured');
    }

    const collection = await getImagesCollection();
    const images = await collection.find({}, { 
      projection: { _id: 1, id: 1, popularity: 1 } 
    }).toArray();
    
    const stats: Record<string, number> = {};
    for (const image of images) {
      const imageId = image.id?.toString();
      if (imageId !== undefined && image.popularity) {
        stats[imageId] = image.popularity;
      }
    }
    
    return stats;
  }
}
