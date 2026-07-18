import type { ImageData, MatchInfo, SearchResult } from '../../types'
import { calculateTotalScore, isExactMatch, processSearchKeyword } from './searchAlgorithm'

type CustomKeyMap = Record<string, { value?: string[] }>

/** Pure metadata search. Data loading and URL resolution belong to the service layer. */
export class SearchEngine {
  constructor(private readonly customKeyMap: CustomKeyMap = {}) {}

  async searchInData(
    data: ImageData[],
    queryKeyword: string,
    fuzzy = false,
  ): Promise<SearchResult[]> {
    const keywords = processSearchKeyword(queryKeyword)
    const results: SearchResult[] = []

    data.forEach((item, index) => {
      const { score, matches } = this.calculateMetadataScore(item, keywords, fuzzy)
      const result = this.toResult(item, index, score, matches)

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

  private calculateMetadataScore(
    item: ImageData,
    keywords: string[],
    fuzzy: boolean,
  ): { score: number, matches?: MatchInfo[] } {
    const primary = calculateTotalScore(item.alt, keywords, fuzzy)
    const secondaryFields = [
      { value: item.description, weight: 2 },
      { value: item.author, weight: 2 },
      { value: item.tags?.join(' '), weight: 2 },
      { value: item.episode, weight: 1 },
    ]
    const secondaryScore = secondaryFields.reduce((score, field) => {
      if (!field.value) return score
      return score + calculateTotalScore(field.value, keywords, fuzzy).score * field.weight
    }, 0)

    return {
      score: primary.score * 10 + secondaryScore,
      matches: primary.matches.length ? primary.matches : undefined,
    }
  }

  private searchCustomKeyMap(data: ImageData[], queryKeyword: string): SearchResult[] {
    if (!Object.hasOwn(this.customKeyMap, queryKeyword)) {
      return []
    }

    const mappedNames = this.customKeyMap[queryKeyword]?.value || []
    return data.flatMap((item, index) => mappedNames.includes(item.alt)
      ? [this.toResult(item, index, 60)]
      : [])
  }

  private toResult(
    item: ImageData,
    index: number,
    score: number,
    matches?: MatchInfo[],
  ): SearchResult {
    return {
      id: item.id?.toString() || index.toString(),
      image: item,
      alt: item.alt,
      author: item.author,
      episode: item.episode,
      popularity: item.popularity,
      description: item.description,
      score,
      matches,
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
