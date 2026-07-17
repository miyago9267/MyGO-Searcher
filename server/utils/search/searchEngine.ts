import type { ImageData, SearchResult } from '../../types'
import { calculateTotalScore, isExactMatch, processSearchKeyword } from './searchAlgorithm'

type CustomKeyMap = Record<string, { value?: string[] }>

/** Pure metadata search. Data loading and URL resolution belong to the service layer. */
export class SearchEngine {
  constructor(private readonly customKeyMap: CustomKeyMap = {}) {}

  async searchInData(
    data: ImageData[],
    queryKeyword: string,
    fuzzy = false
  ): Promise<SearchResult[]> {
    const keywords = processSearchKeyword(queryKeyword)
    const results: SearchResult[] = []

    data.forEach((item, index) => {
      const score = this.calculateMetadataScore(item, keywords, fuzzy)
      const result = this.toResult(item, index, score)

      if (score > 0) {
        results.push(result)
      }

      if (isExactMatch(item.alt, keywords)) {
        results.push({ ...result, score: Math.max(score, 60) })
      }
    })

    results.push(...this.searchCustomKeyMap(data, queryKeyword))
    return this.mergeAndDeduplicateResults(results)
  }

  private calculateMetadataScore(item: ImageData, keywords: string[], fuzzy: boolean): number {
    const weightedFields = [
      { value: item.alt, weight: 10 },
      { value: item.description, weight: 2 },
      { value: item.author, weight: 2 },
      { value: item.tags?.join(' '), weight: 2 },
      { value: item.episode, weight: 1 }
    ]

    return weightedFields.reduce((score, field) => {
      if (!field.value) return score
      return score + calculateTotalScore(field.value, keywords, fuzzy) * field.weight
    }, 0)
  }

  private searchCustomKeyMap(data: ImageData[], queryKeyword: string): SearchResult[] {
    if (!Object.hasOwn(this.customKeyMap, queryKeyword)) {
      return []
    }

    const mappedNames = this.customKeyMap[queryKeyword]?.value || []
    return data.flatMap((item, index) => mappedNames.includes(item.alt)
      ? [{ ...this.toResult(item, index, 60) }]
      : [])
  }

  private toResult(item: ImageData, index: number, score: number): SearchResult {
    return {
      id: item.id?.toString() || index.toString(),
      alt: item.alt,
      author: item.author,
      episode: item.episode,
      popularity: item.popularity,
      score,
      image: item
    }
  }

  private mergeAndDeduplicateResults(results: SearchResult[]): SearchResult[] {
    const uniqueResults = new Map<string, SearchResult>()

    results.forEach((result) => {
      const existing = uniqueResults.get(result.id)
      if (!existing || result.score > existing.score) {
        uniqueResults.set(result.id, result)
      }
    })

    return Array.from(uniqueResults.values()).sort((a, b) => b.score - a.score)
  }
}
