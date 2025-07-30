import { useRuntimeConfig } from 'nuxt/app'
import type { ApiResponse, ApiError } from '~/types/api'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.baseUrl = baseUrl
    } else {
      try {
        const config = useRuntimeConfig()
        this.baseUrl = config.public?.apiBase || '/api/v1'
      } catch (error) {
        // Fallback for server-side rendering or when runtime config is not available
        this.baseUrl = '/api/v1'
      }
    }
    
    // 確保 baseUrl 不以斜線結尾
    this.baseUrl = this.baseUrl.replace(/\/$/, '')
    console.log('ApiClient initialized with baseUrl:', this.baseUrl)
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // 確保 endpoint 以斜線開頭
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const url = `${this.baseUrl}${normalizedEndpoint}`
    
    console.log('Making API request to:', url)
    
    const defaultOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, defaultOptions)
      
      console.log('API response status:', response.status, 'for URL:', url)
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.statusMessage || errorData.message || errorMessage
        } catch (parseError) {
          // 如果無法解析錯誤響應，使用默認錯誤信息
          console.warn('Failed to parse error response:', parseError)
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      // console.log('API response data:', data)
      return data
    } catch (error) {
      console.error(`API request failed for ${url}:`, error)
      throw error
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    let url = endpoint
    
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value))
        }
      })
      
      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    return this.request<T>(url)
  }

  // Health check
  async health(): Promise<{ status: string; timestamp: string; service: string; version: string }> {
    return this.get('/health')
  }
}

// Singleton instance
let apiClientInstance: ApiClient | null = null

export const getApiClient = (): ApiClient => {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient()
  }
  return apiClientInstance
}

// For backward compatibility
export const createApiClient = (baseUrl?: string): ApiClient => {
  return new ApiClient(baseUrl)
}

export { ApiClient }