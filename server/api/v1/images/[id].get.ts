import { getJsonData } from '../../../utils/dataLoader';
import { storageHref } from '../../../utils/dataProcessing';
import { defineEventHandler, getRouterParam, createError } from 'h3';

const baseURL = useRuntimeConfig().NUXT_IMG_BASE_URL;

/**
 * GET /api/v1/images/{id}
 * 獲取特定圖片詳情
 */
export default defineEventHandler(async (event) => {
  try {
    const data_mapping = await getJsonData();
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Image ID is required'
      });
    }

    // 查找圖片 (通過file_name去除副檔名比對ID)
    const imageItem = data_mapping.find((item: any) => {
      const itemId = item.id;
      return itemId === id;
    });

    if (!imageItem) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Image not found'
      });
    }

    return {
      data: {
        id: imageItem.id,
        url: baseURL + storageHref(imageItem),
        alt: imageItem.alt,
        author: imageItem.author,
        episode: imageItem.episode,
        filename: imageItem.filename
      }
    };

  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch image details'
    });
  }
});
