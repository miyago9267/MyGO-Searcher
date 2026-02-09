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
  
  // 從 URL 中取得完整路徑
  // event.context.params.path 是一個陣列,例如 ['mygo', '11', '真不敢相信.jpg']
  const pathArray = event.context.params?.path
  if (!pathArray || (Array.isArray(pathArray) && pathArray.length === 0)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid path',
    })
  }
  
  // 將路徑陣列拼接成完整路徑
  const path = Array.isArray(pathArray) ? pathArray.join('/') : pathArray
  const query = getQuery(event)

  // 建構完整的圖床 URL
  const cdnBaseUrl = config.imageCdnBaseUrl || ''
  if (!cdnBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Image CDN base URL not configured',
    })
  }

  // path 已經包含完整路徑 (例如 mygo/11/真不敢相信.jpg),直接拼接即可
  const cdnUrl = `${cdnBaseUrl}/${path}`
  const queryString = new URLSearchParams(query as Record<string, string>).toString()
  const fullUrl = queryString ? `${cdnUrl}?${queryString}` : cdnUrl

  console.log('[Image Proxy] Path:', path)
  console.log('[Image Proxy] Full URL:', fullUrl)

  try {
    // 使用 proxyRequest 直接轉發請求，支援串流
    return await proxyRequest(event, fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': config.imageCdnBaseUrl || '',
      },
      onResponse(response) {
        // 確保設定正確的 Cache-Control
        response.headers.set('Cache-Control', 'public, max-age=31536000')
        // 如果來源沒有 contentType，嘗試自己判斷
        if (!response.headers.get('content-type')) {
           const contentType = getContentType(path)
           response.headers.set('Content-Type', contentType)
        }
      }
    })
  }
  catch (error: any) {
    console.error('[Image Proxy] Error fetching image:', error)
    throw createError({
      statusCode: error.response?.status || 500,
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
