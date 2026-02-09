import type { ImageData } from '../types'

function processImageRecord(item: ImageData): ImageData {
  const { episode, filename } = item
  if (!episode || !filename) {
    return item
  }

  const processedEpisode = episode.replace(/_/g, '/')
  const processedFilename = `/images/${processedEpisode}/${filename}`

  return {
    ...item,
    filename: processedFilename,
  }
}

export async function getProcessedImageData(rawData: ImageData[]): Promise<ImageData[]> {
  try {
    return rawData.map(processImageRecord)
  }
  catch (error) {
    console.error('Failed to process image data:', error)
    throw error
  }
}

export function getProcessedImageDataSync(rawData: ImageData[]): ImageData[] {
  try {
    return rawData.map(processImageRecord)
  }
  catch (error) {
    console.error('Failed to process image data (sync):', error)
    throw error
  }
}
