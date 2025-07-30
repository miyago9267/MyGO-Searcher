import { jsonData } from '../../../utils/dataLoader';
import { defineEventHandler, getQuery } from 'h3';

const baseURL = useRuntimeConfig().NUXT_IMG_BASE_URL;
const data_mapping = Array.isArray(jsonData) ? jsonData : [];

/**
 * GET /api/v1/images
 * 獲取所有圖片列表，支援分頁
 */
export default defineEventHandler((event) => {
  try {
    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const allImages = data_mapping.map((item: any) => ({
      id: item.file_name.replace(/\.[^/.]+$/, ""), // 移除副檔名作為ID
      url: baseURL + item.file_name,
      alt: item.name,
      author: item.author,
      episode: item.episode,
      filename: item.file_name
    }));

    const paginatedImages = allImages.slice(offset, offset + limit);
    const totalCount = allImages.length;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: paginatedImages,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch images library'
    });
  }
});
