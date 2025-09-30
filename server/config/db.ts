import { MongoClient } from 'mongodb'
import type { Document, Db, Collection } from 'mongodb'

// MongoDB 客戶端實例
let client: MongoClient | null = null
let db: Db | null = null

/**
 * 獲取 MongoDB 連接
 */
export async function getMongoClient(): Promise<MongoClient> {
  // 使用 useRuntimeConfig() 獲取配置
  const config = useRuntimeConfig()
  const MONGODB_URL = config.mongodbConnectUrl

  if (!MONGODB_URL) {
    const errorMsg = '[MongoDB] URL not configured'
    process.stderr.write(`[ERROR] ${errorMsg}\n`)
    throw new Error(errorMsg)
  }

  // 檢查現有連接是否仍然有效
  if (client) {
    try {
      await client.db('admin').command({ ping: 1 })
      process.stderr.write('[INFO] [MongoDB] Existing connection is alive\n')
      return client
    }
    catch {
      process.stderr.write('[WARN] [MongoDB] Existing connection is invalid, creating new connection\n')
      client = null
      db = null
    }
  }

  try {
    const maskedUrl = MONGODB_URL.replace(/\/\/.*@/, '//***:***@')
    process.stderr.write(`[INFO] [MongoDB] Connecting to: ${maskedUrl}\n`)

    client = new MongoClient(MONGODB_URL, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 5000,
      authSource: 'admin',
      directConnection: true,
    })

    await client.connect()
    process.stderr.write('[INFO] [MongoDB] Successfully connected to database\n')

    // 測試連接
    await client.db('admin').command({ ping: 1 })
    process.stderr.write('[INFO] [MongoDB] Ping test successful\n')

    return client
  }
  catch (error: unknown) {
    const errorMsg = `[MongoDB] Connection failed: ${error instanceof Error ? error.message : String(error)}`
    process.stderr.write(`[ERROR] ${errorMsg}\n`)
    client = null
    throw error
  }
}

/**
 * 獲取資料庫實例
 */
export async function getDatabase(): Promise<Db> {
  if (!db) {
    const mongoClient = await getMongoClient()
    db = mongoClient.db()
    process.stderr.write('[INFO] [MongoDB] Database instance created\n')
  }
  return db
}

/**
 * 獲取指定集合
 */
export async function getCollection<T extends Document = Document>(collectionName: string): Promise<Collection<T>> {
  const database = await getDatabase()
  return database.collection<T>(collectionName)
}

/**
 * 獲取圖片集合
 */
export async function getImagesCollection<T extends Document = Document>(): Promise<Collection<T>> {
  const config = useRuntimeConfig()
  const MONGODB_COLLECTION = config.mongodbCollection

  if (!MONGODB_COLLECTION) {
    const errorMsg = '[MongoDB] Collection name not configured'
    process.stderr.write(`[ERROR] ${errorMsg}\n`)
    throw new Error(errorMsg)
  }

  process.stderr.write(`[INFO] [MongoDB] Using collection: ${MONGODB_COLLECTION}\n`)
  return getCollection<T>(MONGODB_COLLECTION)
}

/**
 * 檢查 MongoDB 是否可用
 */
export function isMongoConfigured(): boolean {
  const config = useRuntimeConfig()
  const isConfigured = !!(config.mongodbConnectUrl && config.mongodbCollection)
  process.stderr.write(`[INFO] [MongoDB] Configuration status: ${isConfigured ? 'configured' : 'not configured'}\n`)
  return isConfigured
}

/**
 * 關閉 MongoDB 連接
 */
export async function closeMongoConnection(): Promise<void> {
  if (client) {
    await client.close()
    client = null
    db = null
    process.stderr.write('[INFO] [MongoDB] Connection closed\n')
  }
}

/**
 * 檢查集合是否存在
 */
export async function collectionExists(collectionName: string): Promise<boolean> {
  try {
    const database = await getDatabase()
    const collections = await database.listCollections({ name: collectionName }).toArray()
    const exists = collections.length > 0
    process.stderr.write(`[INFO] [MongoDB] Collection '${collectionName}' exists: ${exists}\n`)
    return exists
  }
  catch (error) {
    const errorMsg = `[MongoDB] Error checking collection existence: ${error}`
    process.stderr.write(`[ERROR] ${errorMsg}\n`)
    return false
  }
}
