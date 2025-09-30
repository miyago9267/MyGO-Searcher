import { SearchEngine } from '../utils/search/searchEngine'
import { sortImages, type SortOrder } from '../utils/sorting'
import { FileRepository } from '../repositories/fileRepository'
import type { SearchParams, SearchResponse, SearchResponseItem } from '../types/'

/**
 * 搜索服務類
 */
export class SearchService {
  private fileRepo = new FileRepository()
  private baseURL: string
  private customKeyMap: Record<string, { value: string[] }>

  constructor(baseURL: string, customKeyMap: Record<string, { value: string[] }>) {
    this.baseURL = baseURL
    this.customKeyMap = customKeyMap
  }

  async search(params: SearchParams): Promise<SearchResponse> {
    // 載入數據
    const data = await this.fileRepo.getSearchData()

    // 初始化搜索引擎
    const searchEngine = new SearchEngine(this.baseURL, this.customKeyMap)

    // 執行搜索
    const searchResults = await searchEngine.searchInData(
      data,
      params.query,
      params.fuzzy,
    )

    // 排序結果
    const sortedResults = await sortImages(searchResults, params.order as SortOrder)

    // 分頁處理
    const totalCount = sortedResults.length
    const totalPages = Math.ceil(totalCount / params.limit)
    const offset = (params.page - 1) * params.limit
    const paginatedResults = sortedResults.slice(offset, offset + params.limit)

    // 構建響應
    return {
      data: paginatedResults.map((item): SearchResponseItem => ({
        id: item.id!,
        url: item.url,
        alt: item.alt,
        author: item.author,
        episode: item.episode,
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
