import { defineEventHandler, getQuery, proxyRequest, createError } from 'h3'

/**
 * 圖片代理端點
 * 接收前端的圖片請求,轉發到實際的圖床位置
 *
 * 範例:
 * 請求: GET /mygo/11/我也一樣.jpg?t=1770616165165
 * 轉發到: https://drive.miyago9267.com/d/file/img/searcher/mygo/11/我也一樣.jpg?t=1770616165165
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const pathArray = event.context.params?.path
  if (!pathArray || (Array.isArray(pathArray) && pathArray.length === 0)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid path',
    })
  }

  const path = Array.isArray(pathArray) ? pathArray.join('/') : pathArray
  const query = getQuery(event)

  const cdnBaseUrl = config.imageCdnBaseUrl || ''
  if (!cdnBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Image CDN base URL not configured',
    })
  }

  const cdnUrl = `${cdnBaseUrl}/${path}`
  const queryString = new URLSearchParams(query as Record<string, string>).toString()
  const fullUrl = queryString ? `${cdnUrl}?${queryString}` : cdnUrl

  console.log('[Image Proxy] Path:', path)
  console.log('[Image Proxy] Full URL:', fullUrl)

  try {
    return await proxyRequest(event, fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': config.imageCdnBaseUrl || '',
      },
      onResponse(response) {
        response.headers.set('Cache-Control', 'public, max-age=31536000')
        if (!response.headers.get('content-type')) {
          const contentType = getContentType(path)
          response.headers.set('Content-Type', contentType)
        }
      },
    })
  }
  catch (error: unknown) {
    console.error('[Image Proxy] Error fetching image:', error)

    interface FetchError {
      response?: {
        status?: number
      }
    }

    const status = (error as FetchError)?.response?.status || 500
    throw createError({
      statusCode: status,
      statusMessage: 'Failed to fetch image',
    })
  }
})

/**
 * 根據檔案副檔名判斷 MIME type
 */
function getContentType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase()
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  }
  return mimeTypes[ext || ''] || 'application/octet-stream'
}
