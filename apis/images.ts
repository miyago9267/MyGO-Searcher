import { getApiClient } from './client'
import type { 
  ImageItem, 
  ApiResponse, 
  SearchParams, 
  PaginationParams, 
  RandomParams 
} from '~/types'

/**
 * Images API service
 */
export class ImagesApi {
  /**
   * Get all images with pagination
   */
  static async getAll(params?: PaginationParams): Promise<ApiResponse<ImageItem[]>> {
    const apiClient = getApiClient()
    return apiClient.get<ApiResponse<ImageItem[]>>('/images', params)
  }

  /**
   * Search images
   */
  static async search(params: SearchParams): Promise<ApiResponse<ImageItem[]>> {
    const apiClient = getApiClient()
    return apiClient.get<ApiResponse<ImageItem[]>>('/images/search', params)
  }

  /**
   * Get random images
   */
  static async getRandom(params?: RandomParams): Promise<ApiResponse<ImageItem[]>> {
    const apiClient = getApiClient()
    return apiClient.get<ApiResponse<ImageItem[]>>('/images/random', params)
  }

  /**
   * Get specific image by ID
   */
  static async getById(id: string): Promise<ApiResponse<ImageItem>> {
    const apiClient = getApiClient()
    return apiClient.get<ApiResponse<ImageItem>>(`/images/${id}`)
  }
}

/**
 * Legacy API functions for backward compatibility
 * @deprecated Use ImagesApi class instead
 */

/**
 * @deprecated Use ImagesApi.search() or ImagesApi.getAll() instead
 */
export const getAllImageList = async (query: string): Promise<ImageItem[]> => {
  try {
    if (query.trim()) {
      const response = await ImagesApi.search({ q: query })
      return response.data
    } else {
      const response = await ImagesApi.getAll()
      return response.data
    }
  } catch (error) {
    console.error('Error fetching image list:', error)
    return []
  }
}

/**
 * Get random images
 */
export const getRandomImages = async (count = 1): Promise<ImageItem[]> => {
  try {
    const response = await ImagesApi.getRandom({ count })
    return response.data
  } catch (error) {
    console.error('Error fetching random images:', error)
    return []
  }
}

/**
 * Search images with fuzzy matching
 */
export const searchImages = async (
  query: string, 
  fuzzy = false, 
  page = 1, 
  limit = 20
): Promise<{ images: ImageItem[]; meta: any }> => {
  try {
    const response = await ImagesApi.search({ q: query, fuzzy, page, limit })
    return { images: response.data, meta: response.meta }
  } catch (error) {
    console.error('Error searching images:', error)
    return { images: [], meta: null }
  }
}
