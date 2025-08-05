import { readFileSync } from 'fs';
import { join } from 'path';
import { getImagesCollection, isMongoConfigured, collectionExists } from '../config/database';
import { getProcessedImageData, getProcessedImageDataSync } from './dataProcessing';

// 從 MongoDB 載入資料
export const loadFromMongoDB = async (): Promise<any[]> => {
	if (!isMongoConfigured()) {
		throw new Error('MongoDB URL or Collection not configured');
	}

	try {
		console.log('Attempting to connect to MongoDB...');
		
		// 檢查集合是否存在
		const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || '';
		const exists = await collectionExists(MONGODB_COLLECTION);
		if (!exists) {
			console.warn(`Collection '${MONGODB_COLLECTION}' does not exist`);
			throw new Error(`Collection '${MONGODB_COLLECTION}' does not exist`);
		}
		
		// 獲取圖片集合
		const collection = await getImagesCollection();
		const data = await collection.find({}).toArray();
		
		console.log(`Loaded ${data.length} records from MongoDB`);
		return data;
	} catch (error: any) {
		// 檢查各種連接錯誤
		let errorType = 'Unknown error';
		if (error.message.includes('Authentication failed')) {
			errorType = 'Authentication failed - Check username/password in connection string';
		} else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
			errorType = 'Host not found - Check MongoDB server address';
		} else if (error.message.includes('ECONNREFUSED')) {
			errorType = 'Connection refused - Check if MongoDB server is running';
		} else if (error.message.includes('Timeout')) {
			errorType = 'Connection timeout - Check network and server status';
		} else if (error.message.includes('does not exist')) {
			errorType = 'Collection not found';
		}
		
		console.error(`MongoDB connection error (${errorType}):`, error.message);
		throw new Error(`MongoDB connection failed: ${errorType}`);
	}
}

// 從本地檔案載入資料
export function loadFromLocalFile(): any[] {
	try {
		const dataPath = join(process.cwd(), 'public', 'data', 'image_map.json');
		const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
		console.log(`Loaded ${data.length} records from local file`);
		return data;
	} catch (error: any) {
		console.error('Failed to load local file:', error.message);
		throw new Error(`Failed to load local data file: ${error.message}`);
	}
}

// 緩存載入的資料
let cachedData: any[] | null = null;
let dataLoadPromise: Promise<any[]> | null = null;

// 異步資料載入函數
async function loadData(): Promise<any[]> {
	if (cachedData) {
		return cachedData;
	}

	if (dataLoadPromise) {
		return dataLoadPromise;
	}

	dataLoadPromise = (async () => {
		try {
			// 如果有設定 MongoDB 參數，優先從 MongoDB 讀取
			if (isMongoConfigured()) {
				console.log('Attempting to load data from MongoDB...');
				const data = await loadFromMongoDB();
				cachedData = data;
				return data;
			} else {
				console.log('No MongoDB configuration found, using local file...');
			}
		} catch (error: any) {
			console.warn('Failed to load from MongoDB, falling back to local file:', error.message);
		}

		// 否則從本地檔案讀取
		console.log('Loading data from local file...');
		const data = loadFromLocalFile();
		cachedData = data;
		return data;
	})();

	return dataLoadPromise;
}

// 提供異步獲取資料的函數
export async function getJsonData(): Promise<any[]> {
	try {
		// 先獲取原始資料
		const rawData = await loadData();
		
		// 統一使用 special.ts 處理資料
		const processedData = await getProcessedImageData(rawData);
		
		return processedData;
	} catch (error) {
		console.error('Failed to get processed image data:', error);
		throw error;
	}
}

// 為了向後兼容，保留同步版本（使用本地檔案）
export const jsonData = (() => {
	try {
		// 如果沒有 MongoDB 設定，直接使用本地檔案並處理
		if (!isMongoConfigured()) {
			const rawData = loadFromLocalFile();
			return getProcessedImageDataSync(rawData);
		}
		
		// 如果有 MongoDB 設定，先返回空陣列，讓 API 使用 getJsonData()
		return [];
	} catch (error) {
		console.warn('Failed to load local file, returning empty array:', error);
		return [];
	}
})();

export const customKeyMap = (() => {
	const dataPath = join(process.cwd(), 'public', 'data', 'custom_keymap.json');
	return JSON.parse(readFileSync(dataPath, 'utf-8'));
})();