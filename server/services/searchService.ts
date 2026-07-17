import { SearchEngine } from '../utils/search/searchEngine';
import { sortImages, type SortOrder } from '../utils/sorting';
import { FileRepository } from '../repositories/fileRepository';
import type { ImageData, SearchParams, SearchResponse, SearchResponseItem } from '../types/';
import type { ImageUrlResolver } from '../utils/imageUrlResolver';

export interface SearchDataSource {
  getSearchData(): Promise<ImageData[]>;
}

interface SearchServiceOptions {
  resolveImageUrl: ImageUrlResolver;
  customKeyMap?: Record<string, { value?: string[] }>;
  dataSource?: SearchDataSource;
}

/**
 * 搜索服務類
 */
export class SearchService {
  private dataSource: SearchDataSource;
  private resolveImageUrl: ImageUrlResolver;
  private customKeyMap: Record<string, { value?: string[] }>;

  constructor(options: SearchServiceOptions) {
    this.dataSource = options.dataSource || new FileRepository();
    this.resolveImageUrl = options.resolveImageUrl;
    this.customKeyMap = options.customKeyMap || {};
  }

  async search(params: SearchParams): Promise<SearchResponse> {
    // 載入數據
    const data = await this.dataSource.getSearchData();
    
    // 初始化搜索引擎
    const searchEngine = new SearchEngine(this.customKeyMap);
    
    // 執行搜索
    const searchResults = await searchEngine.searchInData(
      data, 
      params.query, 
      params.fuzzy
    );

    // 排序結果
    const sortedResults = await sortImages(searchResults, params.order as SortOrder);

    // 分頁處理
    const totalCount = sortedResults.length;
    const totalPages = Math.ceil(totalCount / params.limit);
    const offset = (params.page - 1) * params.limit;
    const paginatedResults = sortedResults.slice(offset, offset + params.limit);

    // 構建響應
    return {
      data: paginatedResults.map((item): SearchResponseItem => ({
        id: item.id!,
        url: this.resolveImageUrl(item.image),
        alt: item.alt,
        author: item.author,
        episode: item.episode
      })),
      meta: {
        query: params.query,
        fuzzy: params.fuzzy,
        total: totalCount,
        page: params.page,
        limit: params.limit,
        totalPages,
        hasNext: params.page < totalPages,
        hasPrev: params.page > 1
      }
    };
  }
}
