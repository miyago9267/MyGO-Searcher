import { ImagesApi } from '~/apis/images'

/**
 * 組合式函數：處理圖片人氣統計
 */
export function usePopularity() {
  /**
   * 記錄複製動作
   */
  const recordCopy = async (imageId?: string, imageUrl?: string) => {
    try {
      console.log('recordCopy called with:', { imageId, imageUrl });
      await ImagesApi.updatePopularity({
        imageId,
        imageUrl,
        action: 'copy'
      })
      console.log('Copy action recorded successfully')
    } catch (error) {
      console.warn('Failed to record copy action:', error)
      // 不拋出錯誤，讓用戶操作繼續進行
    }
  }

  /**
   * 記錄下載動作
   */
  const recordDownload = async (imageId?: string, imageUrl?: string) => {
    try {
      await ImagesApi.updatePopularity({
        imageId,
        imageUrl,
        action: 'download'
      })
      console.log('Download action recorded successfully')
    } catch (error) {
      console.warn('Failed to record download action:', error)
      // 不拋出錯誤，讓用戶操作繼續進行
    }
  }

  return {
    recordCopy,
    recordDownload
  }
}
