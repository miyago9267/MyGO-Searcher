import { getApiClient } from './client'
import type {
  ImageItem,
  ApiResponse,
  SearchParams,
  PaginationParams,
  RandomParams,
  SearchMeta,
} from '~/types'

/**
 * Images API service helpers
 */
export const ImagesApi = {
  async getAll(params?: PaginationParams): Promise<ApiResponse<ImageItem[]>> {
    const apiClient = getApiClient()
    return apiClient.get<ApiResponse<ImageItem[]>>('/images', params)
  },

  async search(params: SearchParams): Promise<ApiResponse<ImageItem[]>> {
    const apiClient = getApiClient()
    return apiClient.get<ApiResponse<ImageItem[]>>('/images/search', params)
  },

  async getRandom(params?: RandomParams): Promise<ApiResponse<ImageItem[]>> {
    const apiClient = getApiClient()
    return apiClient.get<ApiResponse<ImageItem[]>>('/images/random', params)
  },

  async getById(id: string): Promise<ApiResponse<ImageItem>> {
    const apiClient = getApiClient()
    return apiClient.get<ApiResponse<ImageItem>>(`/images/${id}`)
  },

  async updatePopularity(params: {
    imageId?: string
    imageUrl?: string
    action: 'copy' | 'download'
  }): Promise<{ success: boolean, action: string, imageId: string, updated: boolean }> {
    const apiClient = getApiClient()
    return apiClient.post<{ success: boolean, action: string, imageId: string, updated: boolean }>(
      '/images/popularity',
      params,
    )
  },
} as const

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
    }
    else {
      const response = await ImagesApi.getAll()
      return response.data
    }
  }
  catch (error) {
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
  }
  catch (error) {
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
  limit = 20,
): Promise<{ images: ImageItem[], meta: SearchMeta | undefined }> => {
  try {
    const response = await ImagesApi.search({ q: query, fuzzy, page, limit })
    return { images: response.data, meta: response.meta }
  }
  catch (error) {
    console.error('Error searching images:', error)
    return { images: [], meta: undefined }
  }
}
