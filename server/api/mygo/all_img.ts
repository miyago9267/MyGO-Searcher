import { defineEventHandler } from 'h3'
import { getJsonData } from '../../utils/dataLoader'
import type { ImageData } from '../../types'

const baseURL = ''

export const getPicList = async () => {
  try {
    const dataMapping = await getJsonData()
    const allFiles = dataMapping.map((item: ImageData) => ({
      url: baseURL + (item.filename ?? ''),
      alt: item.alt,
      author: item.author,
      episode: item.episode,
    }))
    return { statusCode: 200, urls: allFiles }
  }
  catch (error) {
    console.error('Failed to fetch images library:', error)
    return { statusCode: 400, error: 'Fail to fetch images library.' }
  }
}

export default defineEventHandler(async () => {
  return await getPicList()
})
