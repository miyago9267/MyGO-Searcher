import { useRuntimeConfig } from '#app'
import type { ApiResponse, ApiError } from './types'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    // If no baseUrl provided, try to get it from runtime config
    if (baseUrl) {
      this.baseUrl = baseUrl
    } else {
      try {
        const config = useRuntimeConfig()
        this.baseUrl = config.public.apiBase || '/api/v1'
      } catch (error) {
        // Fallback for server-side rendering or when runtime config is not available
        this.baseUrl = '/api/v1'
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
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
      
      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.statusMessage || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    let url = endpoint
    
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`
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
