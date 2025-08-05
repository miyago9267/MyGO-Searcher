import type { SearchResult, ImageData } from '../../types';
import { calculateTotalScore, isExactMatch, processSearchKeyword } from './searchAlgorithm';

/**
 * 搜索引擎類
 */
export class SearchEngine {
	private baseURL: string;
	private customKeyMap: any;

	constructor(baseURL: string, customKeyMap: any) {
		this.baseURL = baseURL;
		this.customKeyMap = customKeyMap;
	}

	/**
	 * 在數據中搜索匹配項
	 */
	async searchInData(
		data: ImageData[], 
		queryKeyword: string, 
		fuzzy: boolean = false
	): Promise<SearchResult[]> {
		const keywords = processSearchKeyword(queryKeyword);
		const scoredResults: SearchResult[] = [];
		const fullMatchResults: SearchResult[] = [];
		const customKeymapResults: SearchResult[] = [];

		// 主要搜索邏輯
		data.forEach((item, index) => {
			const totalScore = calculateTotalScore(item.alt, keywords, fuzzy);
			
			const imageItem: SearchResult = {
				id: index.toString(),
				url: this.baseURL + (item.filename || item.file_name || ''),
				alt: item.alt,
				author: item.author,
				episode: item.episode,
				score: totalScore
			};

			// 評分匹配
			if (totalScore > 0) {
				scoredResults.push(imageItem);
			}

			// 精準匹配
			if (isExactMatch(item.alt, keywords)) {
				fullMatchResults.push({ ...imageItem, score: 15 });
			}
		});

		// 自定義關鍵字映射 - 使用原始查詢關鍵詞
		const customResults = this.searchCustomKeyMap(data, queryKeyword);
		customKeymapResults.push(...customResults);

		// 合併結果並去重
		return this.mergeAndDeduplicateResults([
			...scoredResults, 
			...fullMatchResults, 
			...customKeymapResults
		]);
	}

	/**
	 * 搜索自定義關鍵字映射
	 */
	private searchCustomKeyMap(data: ImageData[], queryKeyword: string): SearchResult[] {
		// 使用原始查詢關鍵詞，而不是處理過的關鍵詞
		if (!this.customKeyMap.hasOwnProperty(queryKeyword)) {
			return [];
		}

		const keywordValue = this.customKeyMap[queryKeyword]?.value || [];
		const results: SearchResult[] = [];

		data.forEach((item, index) => {
			if (keywordValue.includes(item.alt)) {
				results.push({
					id: index.toString(),
					url: this.baseURL + (item.filename || item.file_name || ''),
					alt: item.alt,
					author: item.author,
					episode: item.episode,
					score: 15,
				});
			}
		});

		return results;
	}

	/**
	 * 合併結果並去重
	 */
	private mergeAndDeduplicateResults(results: SearchResult[]): SearchResult[] {
		const combinedResultsMap = new Map<string, SearchResult>();
		
		results.forEach((result) => {
			const existing = combinedResultsMap.get(result.url);
			if (!existing || result.score > existing.score) {
				combinedResultsMap.set(result.url, result);
			}
		});

		return Array.from(combinedResultsMap.values())
			.sort((a, b) => b.score - a.score);
	}
}
