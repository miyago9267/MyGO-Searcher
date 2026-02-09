import { defineEventHandler, getQuery } from 'h3'
import { getJsonData } from '../../utils/dataLoader'
import type { ImageData } from '../../types'

const baseURL = ''

export const getRandomPic = async (amount: number) => {
  try {
    const dataMapping = await getJsonData()

    if (amount > dataMapping.length) {
      throw new Error('Requested amount exceeds available images.')
    }

    const shuffled = [...dataMapping].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, amount)
    const picFiles = selected.map((item: ImageData) => ({
      url: baseURL + (item.filename ?? ''),
      alt: item.alt,
    }))

    return { statusCode: 200, urls: picFiles }
  }
  catch (error) {
    console.error(error)
    return { statusCode: 400, error: 'Fail to fetch images library.' }
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const amount = Number.parseInt(query.amount as string, 10) || 1
  return getRandomPic(amount)
})
