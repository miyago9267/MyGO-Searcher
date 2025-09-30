import { readFileSync } from 'fs'
import { join } from 'path'
import { getImagesCollection, isMongoConfigured, collectionExists } from '../config/db'
import { getProcessedImageData, getProcessedImageDataSync } from './dataProcessing'
import type { ImageData } from '../types'

// 從 MongoDB 載入資料
export const loadFromMongoDB = async (): Promise<Record<string, unknown>[]> => {
  if (!isMongoConfigured()) {
    throw new Error('MongoDB URL or Collection not configured')
  }

  try {
    console.log('Attempting to connect to MongoDB...')

    // 檢查集合是否存在
    const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || ''
    const exists = await collectionExists(MONGODB_COLLECTION)
    if (!exists) {
      console.warn(`Collection '${MONGODB_COLLECTION}' does not exist`)
      throw new Error(`Collection '${MONGODB_COLLECTION}' does not exist`)
    }

    // 獲取圖片集合
    const collection = await getImagesCollection()
    const data = await collection.find({}).toArray()

    console.log(`Loaded ${data.length} records from MongoDB`)
    return data
  }
  catch (error: unknown) {
    console.error(`MongoDB connection error:`, (error as Error).message)
    throw new Error(`MongoDB connection failed: ${(error as Error).message}`)
  }
}

// 從本地檔案載入資料
export function loadFromLocalFile(): Record<string, unknown>[] {
  try {
    const dataPath = join(process.cwd(), 'public', 'data', 'image_map.json')
    const data = JSON.parse(readFileSync(dataPath, 'utf-8'))
    console.log(`Loaded ${data.length} records from local file`)
    return data
  }

  catch (error: unknown) {
    console.error(`Local file loading error:`, (error as Error).message)
    throw new Error(`Local file loading failed: ${(error as Error).message}`)
  }
}

// 緩存載入的資料
let cachedData: ImageData[] | null = null
let dataLoadPromise: Promise<ImageData[]> | null = null

// 異步資料載入函數
async function loadData(): Promise<ImageData[]> {
  if (cachedData) {
    return cachedData
  }

  if (dataLoadPromise) {
    return dataLoadPromise
  }

  dataLoadPromise = (async () => {
    try {
      // 如果有設定 MongoDB 參數，優先從 MongoDB 讀取
      if (isMongoConfigured()) {
        console.log('Attempting to load data from MongoDB...')
        const rawData = await loadFromMongoDB()
        // Convert rawData to ImageItem[] safely
        const imageItems: ImageData[] = (rawData as Record<string, unknown>[]).map(item => ({
          url: item['url'] as string,
          alt: item['alt'] as string,
          ...item,
        })) as ImageData[]
        const processedData = await getProcessedImageData(imageItems)
        cachedData = processedData
        return processedData
      }
      else {
        console.log('No MongoDB configuration found, using local file...')
      }
    }
    catch (error: unknown) {
      console.warn('Failed to load from MongoDB, falling back to local file:', (error as Error).message)
    }
    // 否則從本地檔案讀取
    console.log('Loading data from local file...')
    const rawData = loadFromLocalFile()
    // Convert rawData to ImageItem[]
    const imageItems: ImageData[] = (rawData as Record<string, unknown>[]).map(item => ({
      url: item['url'] as string,
      alt: item['alt'] as string,
      ...item,
    })) as ImageData[]
    const processedData = getProcessedImageDataSync(imageItems)
    cachedData = processedData
    return processedData
  })()

  return dataLoadPromise
}

// 提供異步獲取資料的函數
export async function getJsonData(): Promise<ImageData[]> {
  try {
    // 先獲取原始資料
    const rawData = await loadData()

    // 統一使用 special.ts 處理資料
    const processedData = await getProcessedImageData(rawData as ImageData[])

    return processedData
  }
  catch (error) {
    console.error('Failed to get processed image data:', error)
    throw error
  }
}

// 為了向後兼容，保留同步版本（使用本地檔案）
export const jsonData = (() => {
  try {
    // 如果沒有 MongoDB 設定，直接使用本地檔案並處理
    if (!isMongoConfigured()) {
      const rawData = loadFromLocalFile()
      const imageItems: ImageData[] = (rawData as Record<string, unknown>[]).map(item => ({
        url: item['url'] as string,
        alt: item['alt'] as string,
        ...item,
      })) as ImageData[]
      return getProcessedImageDataSync(imageItems)
    }

    // 如果有 MongoDB 設定，先返回空陣列，讓 API 使用 getJsonData()
    return []
  }
  catch (error) {
    console.warn('Failed to load local file, returning empty array:', error)
    return []
  }
})()

export const customKeyMap = (() => {
  const dataPath = join(process.cwd(), 'public', 'data', 'custom_keymap.json')
  return JSON.parse(readFileSync(dataPath, 'utf-8'))
})()
