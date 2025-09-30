import { useRuntimeConfig } from 'nuxt/app'

type QueryParamValue = string | number | boolean | null | undefined
type QueryParams = Record<string, QueryParamValue>

class ApiClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.baseUrl = baseUrl
    }
    else {
      try {
        const config = useRuntimeConfig()
        this.baseUrl = config.public?.apiBase || '/api/v1'
      }
      catch {
        // Fallback for server-side rendering or when runtime config is not available
        this.baseUrl = '/api/v1'
      }
    }

    // 確保 baseUrl 不以斜線結尾
    this.baseUrl = this.baseUrl.replace(/\/$/, '')

    // 使用 stderr 在服務器端輸出日誌
    if (import.meta.server) {
      process.stderr.write(`[ApiClient] Initialized with baseUrl: ${this.baseUrl}\n`)
    }
    else {
      console.log('[ApiClient] Initialized with baseUrl:', this.baseUrl)
    }
  }

  private getFullUrl(endpoint: string): string {
    // 確保 endpoint 以斜線開頭
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

    if (import.meta.server) {
      // 在服務器端 SSR 時，使用完整的內部 URL，包含 baseUrl
      const fullPath = `${this.baseUrl}${normalizedEndpoint}`
      const url = `http://localhost:3000${fullPath}`

      process.stderr.write(`[ApiClient] SSR URL construction - baseUrl: ${this.baseUrl}, endpoint: ${normalizedEndpoint}, full URL: ${url}\n`)

      return url
    }
    else {
      // 在客戶端，使用相對路徑
      const url = `${this.baseUrl}${normalizedEndpoint}`
      console.log('[ApiClient] Client URL construction - baseUrl:', this.baseUrl, 'endpoint:', normalizedEndpoint, 'full URL:', url)
      return url
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = this.getFullUrl(endpoint)

    // 使用適當的日誌輸出方式
    if (import.meta.server) {
      process.stderr.write(`[ApiClient] Making API request to: ${url}\n`)
    }
    else {
      console.log('[ApiClient] Making API request to:', url)
    }

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

      if (import.meta.server) {
        process.stderr.write(`[ApiClient] Response status: ${response.status} for URL: ${url}\n`)
      }
      else {
        console.log('[ApiClient] Response status:', response.status, 'for URL:', url)
      }

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`

        try {
          const errorData = await response.json()
          errorMessage = errorData.statusMessage || errorData.message || errorMessage
        }
        catch (parseError) {
          // 如果無法解析錯誤響應，使用默認錯誤信息
          if (import.meta.server) {
            process.stderr.write(`[ApiClient] Failed to parse error response: ${parseError}\n`)
          }
          else {
            console.warn('[ApiClient] Failed to parse error response:', parseError)
          }
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      return data
    }
    catch (error) {
      const errorMsg = `API request failed for ${url}: ${error}`
      if (import.meta.server) {
        process.stderr.write(`[ERROR] ${errorMsg}\n`)
      }
      else {
        console.error(errorMsg)
      }
      throw error
    }
  }

  async get<T>(endpoint: string, params?: QueryParams): Promise<T> {
    let url = endpoint

    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
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

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const logMsg = `POST request to: ${endpoint} with data: ${JSON.stringify(data)}`
    if (import.meta.server) {
      process.stderr.write(`[ApiClient] ${logMsg}\n`)
    }
    else {
      console.log('[ApiClient]', logMsg)
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // Health check
  async health(): Promise<{ status: string, timestamp: string, service: string, version: string }> {
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
