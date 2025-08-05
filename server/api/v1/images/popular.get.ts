import { defineEventHandler, getQuery, createError } from 'h3';
import { getImagesCollection, isMongoConfigured } from '../../../utils/db';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * GET /api/v1/images/popular
 * 獲取熱門圖片列表
 * Query parameters:
 * - limit: 數量限制 (預設20)
 */
export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const limit = parseInt(query.limit as string) || 20;

		// 如果有MongoDB配置，從數據庫查詢
		if (isMongoConfigured()) {
			try {
				const collection = await getImagesCollection();
				
				// 查詢熱門圖片，按人氣降序排列
				const popularImages = await collection
					.find({})
					.sort({ popularity: -1 })
					.limit(limit)
					.toArray();

				return {
					statusCode: 200,
					data: popularImages,
					meta: {
						total: popularImages.length,
						limit,
						sortBy: 'popularity'
					}
				};

			} catch (error: any) {
				console.error('MongoDB query error:', error);
				throw createError({
					statusCode: 500,
					statusMessage: 'Database query failed'
				});
			}
		}

		// 如果沒有MongoDB，嘗試從本地文件讀取
		try {
			const STATS_FILE_PATH = join(process.cwd(), 'data', 'popularity-stats.json');
			const statsData = JSON.parse(await fs.readFile(STATS_FILE_PATH, 'utf-8'));
			
			// 將統計數據轉換為數組並排序
			const sortedStats = Object.entries(statsData)
				.map(([imageId, stats]: [string, any]) => ({
					id: imageId,
					popularity: stats.popularity || 0
				}))
				.sort((a, b) => b.popularity - a.popularity)
				.slice(0, limit);

			return {
				statusCode: 200,
				data: sortedStats,
				meta: {
					total: sortedStats.length,
					limit,
					sortBy: 'popularity',
					source: 'local-file'
				}
			};
		} catch (error) {
			console.warn('Local stats file not found or unreadable');
		}

		// 如果都沒有，返回空結果
		return {
			statusCode: 200,
			data: [],
			meta: {
				total: 0,
				limit,
				sortBy: 'popularity',
				note: 'No statistics data available'
			}
		};

	} catch (error: any) {
		if (error.statusCode) {
			throw error;
		}
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch popular images'
		});
	}
});
