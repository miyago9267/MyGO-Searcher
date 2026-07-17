import type { ImageData } from '../types'
import { storageHref } from './dataProcessing'

export type ImageUrlResolver = (image: ImageData) => string

const isAbsoluteUrl = (value: string) => /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)

export function createImageUrlResolver(baseUrl = ''): ImageUrlResolver {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '')

  return (image) => {
    const href = image.url?.trim() || storageHref(image)
    if (!href || isAbsoluteUrl(href) || !normalizedBaseUrl) {
      return href
    }

    return `${normalizedBaseUrl}/${href.replace(/^\//, '')}`
  }
}
