import type { ImageItem } from '../../types/image';

/**
 * 定址與契約在這裡分離：
 *
 * - `filename` 是 v1 契約欄位（docs/API.md），一律保持資料庫裡的原樣（純檔名），
 *   任何情況下都不改寫。
 * - `storagePath` 是儲存層的定址路徑，只給組 URL 用，不出現在 API 回應。
 *   有 `key`（遷移註冊表寫入的物件鍵）就用 key；沒有就退回舊行為，由
 *   episode 推導（mujica_9 -> /mujica/9/檔名.jpg）。
 *
 * fallback 讓沒有 key 的資料維持原本的 URL，因此註冊表可以逐筆補齊，
 * 不需要一次性切換。
 */
function resolveItem(item: any): ImageItem {
  // key 來自 DB，不可信任型別：非字串或空字串一律當作沒有，退回 episode 推導
  const rawKey = typeof item.key === 'string' ? item.key.trim() : '';
  // baseURL 不帶尾斜線，定址路徑必須自帶頭斜線
  const key = rawKey ? (rawKey.startsWith('/') ? rawKey : `/${rawKey}`) : null;

  const episodePath = item.episode && item.filename
    ? `/${String(item.episode).replace(/_/g, '/')}/${item.filename}`
    : null;

  const storagePath = key ?? episodePath;
  return storagePath ? { ...item, storagePath } : item;
}

/**
 * 取出項目的定址路徑，供組 URL 使用。
 * 舊資料（未經 resolveItem 或來自 file_name 格式）自然退回原欄位。
 */
export function storageHref(item: any): string {
  return item.storagePath ?? item.filename ?? item.file_name ?? '';
}

/**
 * 處理從 dataLoader 拿到的資料：附加 storagePath，不改寫任何既有欄位
 */
export async function getProcessedImageData(rawData: any[]): Promise<ImageItem[]> {
  try {
    return rawData.map(resolveItem);
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
    return rawData.map(resolveItem);
  } catch (error) {
    console.error('Failed to process image data (sync):', error);
    throw error;
  }
}
