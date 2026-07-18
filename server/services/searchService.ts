import { FileRepository } from '../repositories/fileRepository'
import type { ImageData, SearchParams, SearchResponse, SearchResponseItem, SearchResult } from '../types'
import type { ImageUrlResolver } from '../utils/imageUrlResolver'
import { SearchEngine } from '../utils/search/searchEngine'
import { sortImages, type SortOrder } from '../utils/sorting'
import { SemanticSearchService } from './semanticSearchService'

export interface SearchDataSource {
  getSearchData(): Promise<ImageData[]>
}

interface SearchServiceOptions {
  resolveImageUrl: ImageUrlResolver
  customKeyMap?: Record<string, { value?: string[] }>
  dataSource?: SearchDataSource
}

export class SearchService {
  private readonly dataSource: SearchDataSource
  private readonly resolveImageUrl: ImageUrlResolver
  private readonly customKeyMap: Record<string, { value?: string[] }>

  constructor(options: SearchServiceOptions) {
    this.dataSource = options.dataSource || new FileRepository()
    this.resolveImageUrl = options.resolveImageUrl
    this.customKeyMap = options.customKeyMap || {}
  }

  async search(params: SearchParams): Promise<SearchResponse> {
    const data = await this.dataSource.getSearchData()
    const searchEngine = new SearchEngine(this.customKeyMap)
    let searchResults: SearchResult[]

    if (params.semantic) {
      try {
        const semanticService = SemanticSearchService.getInstance()
        searchResults = await semanticService.search(params.query, data, data.length)
      }
      catch (error) {
        console.error('Semantic search failed, falling back to keyword search:', error)
        searchResults = await searchEngine.searchInData(data, params.query, params.fuzzy)
      }
    }
    else {
      searchResults = await searchEngine.searchInData(data, params.query, params.fuzzy)
    }

    const sortedResults = await sortImages(searchResults, params.order as SortOrder)
    const totalCount = sortedResults.length
    const totalPages = Math.ceil(totalCount / params.limit)
    const offset = (params.page - 1) * params.limit
    const paginatedResults = sortedResults.slice(offset, offset + params.limit)

    return {
      data: paginatedResults.map((item): SearchResponseItem => ({
        id: item.id,
        url: this.resolveImageUrl(item.image),
        alt: item.alt,
        author: item.author,
        episode: item.episode,
        tags: item.image.tags,
        popularity: item.popularity,
        description: item.description,
        matches: item.matches,
      })),
      meta: {
        query: params.query,
        fuzzy: params.fuzzy,
        total: totalCount,
        page: params.page,
        limit: params.limit,
        totalPages,
        hasNext: params.page < totalPages,
        hasPrev: params.page > 1,
      },
    }
  }
}
