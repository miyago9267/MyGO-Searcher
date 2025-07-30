import { jsonData } from '../../../utils/dataLoader';
import { defineEventHandler, getQuery, createError } from 'h3';

const baseURL = useRuntimeConfig().NUXT_IMG_BASE_URL;
const data_mapping = Array.isArray(jsonData) ? jsonData : [];

/**
 * GET /api/v1/images/random
 * 獲取隨機圖片
 * Query parameters:
 * - count: 圖片數量 (預設1, 最大100)
 */
export default defineEventHandler((event) => {
  try {
    const query = getQuery(event);
    const count = Math.min(parseInt(query.count as string) || parseInt(query.amount as string) || 1, 100);

    if (count <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Count must be greater than 0'
      });
    }

    if (count > data_mapping.length) {
      throw createError({
        statusCode: 400,
        statusMessage: `Requested count (${count}) exceeds available images (${data_mapping.length})`
      });
    }

    const randomImages = data_mapping
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
      .map((item: any) => ({
        id: item.file_name.replace(/\.[^/.]+$/, ""),
        url: baseURL + item.file_name,
        alt: item.name,
        author: item.author,
        episode: item.episode
      }));

    return {
      data: randomImages,
      meta: {
        count,
        requested: count
      }
    };

  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch random images'
    });
  }
});
