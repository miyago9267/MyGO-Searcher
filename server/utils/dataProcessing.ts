import type { ImageData } from '../types'

function resolveItem(item: ImageData): ImageData {
  const rawKey = typeof item.key === 'string' ? item.key.trim() : ''
  const storageKey = rawKey ? `/${rawKey.replace(/^\/+/, '')}` : ''
  const legacyPath = item.episode && item.filename
    ? `/${item.episode.replace(/_/g, '/')}/${item.filename}`
    : ''

  const storagePath = storageKey || legacyPath
  return storagePath ? { ...item, storagePath } : item
}

export function storageHref(item: ImageData): string {
  return item.storagePath ?? item.filename ?? item.file_name ?? ''
}

export async function getProcessedImageData(rawData: ImageData[]): Promise<ImageData[]> {
  return rawData.map(resolveItem)
}

export function getProcessedImageDataSync(rawData: ImageData[]): ImageData[] {
  return rawData.map(resolveItem)
}
