import type { ImageItem } from '../../types/image';

/**
 * 處理從 dataLoader 拿到的資料
 * 將 file_name 修改為 episode + file_name 的格式
 * 將 episode 中的底線替換為斜線
 */
export async function getProcessedImageData(rawData: any[]): Promise<ImageItem[]> {
  try {
    return rawData.map((item: any) => {
      if (!item.episode || !item.filename) {
        return item;
      }
      
      // 將 episode 中的底線替換為斜線
      const processedEpisode = item.episode.replace(/_/g, '/');
      
      // 將 file_name 修改為 episode + file_name
      const processedFileName = `/${processedEpisode}/${item.filename}`;
      
      return {
        ...item,
        filename: processedFileName
      };
    });
  } catch (error) {
    console.error('Failed to process image data:', error);
    throw error;
  }
}

/**
 * 同步版本的資料處理函數（用於向後兼容）
 */
export function getProcessedImageDataSync(rawData: any[]): ImageItem[] {
  try {
    return rawData.map((item: any) => {
      if (!item.episode || !item.filename) {
        return item;
      }
      
      // 將 episode 中的底線替換為斜線
      const processedEpisode = item.episode.replace(/_/g, '/');

      // 將 filename 修改為 episode + filename
      const processedFileName = `/${processedEpisode}/${item.filename}`;

      return {
        ...item,
        filename: processedFileName
      };
    });
  } catch (error) {
    console.error('Failed to process image data (sync):', error);
    throw error;
  }
}
