import { MongoClient, Db, Collection } from 'mongodb';
import type { Document } from 'mongodb';

// MongoDB 連接設定
const MONGODB_URL = process.env.MONGODB_CONNECT_URL || '';
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || '';

// MongoDB 客戶端實例
let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * 獲取 MongoDB 連接
 */
export async function getMongoClient(): Promise<MongoClient> {
  if (!MONGODB_URL) {
    throw new Error('MongoDB URL not configured');
  }

  // 檢查現有連接是否仍然有效
  if (client) {
    try {
      await client.db('admin').command({ ping: 1 });
      return client;
    } catch (error) {
      console.warn('Existing MongoDB connection is invalid, creating new connection');
      client = null;
      db = null;
    }
  }

  try {
    console.log(`Connecting to MongoDB: ${MONGODB_URL.replace(/\/\/.*@/, '//***:***@')}`);
    
    client = new MongoClient(MONGODB_URL, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 5000,
      authSource: 'admin',
      directConnection: true,
    });

    await client.connect();
    console.log('Successfully connected to MongoDB');
    
    // 測試連接
    await client.db('admin').command({ ping: 1 });
    console.log('MongoDB ping successful');
    
    return client;
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    client = null;
    throw error;
  }
}

/**
 * 獲取資料庫實例
 */
export async function getDatabase(): Promise<Db> {
  if (!db) {
    const mongoClient = await getMongoClient();
    db = mongoClient.db();
  }
  return db;
}

/**
 * 獲取指定集合
 */
export async function getCollection<T extends Document = Document>(collectionName: string): Promise<Collection<T>> {
  const database = await getDatabase();
  return database.collection<T>(collectionName);
}

/**
 * 獲取圖片集合
 */
export async function getImagesCollection(): Promise<Collection> {
  if (!MONGODB_COLLECTION) {
    throw new Error('MongoDB collection not configured');
  }
  return getCollection(MONGODB_COLLECTION);
}

/**
 * 檢查 MongoDB 是否可用
 */
export function isMongoConfigured(): boolean {
  return !!(MONGODB_URL && MONGODB_COLLECTION);
}

/**
 * 關閉 MongoDB 連接
 */
export async function closeMongoConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
}

/**
 * 檢查集合是否存在
 */
export async function collectionExists(collectionName: string): Promise<boolean> {
  try {
    const database = await getDatabase();
    const collections = await database.listCollections({ name: collectionName }).toArray();
    return collections.length > 0;
  } catch (error) {
    console.error('Error checking collection existence:', error);
    return false;
  }
}