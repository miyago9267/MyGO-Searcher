import { getJsonData, customKeyMap } from '../../../utils/dataLoader';
import { leven_distance } from '../../../algo/levenshtein';
import * as OpenCC from 'opencc-js';
import { defineEventHandler, getQuery, createError } from 'h3';

const baseURL = useRuntimeConfig().NUXT_IMG_BASE_URL;
const data_mapping = Array.isArray(jsonData) ? jsonData : [];
const custom_keymap = customKeyMap;
const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

const fuzzyReplacements: Record<string, string[]> = {
	"你": ["姊"],
	"姊": ["你"],
	"他": ["她"],
	"她": ["他"],
	"欸": ["耶"],
	"耶": ["欸"],
};

function generateFuzzyVariants(keyword: string): Set<string> {
	const variants = new Set<string>([keyword]);
	for (let i = 0; i < keyword.length; i++) {
		const char = keyword[i];
		if (fuzzyReplacements[char]) {
			for (const replacement of fuzzyReplacements[char]) {
				const newVariant = keyword.substring(0, i) + replacement + keyword.substring(i + 1);
				variants.add(newVariant);
			}
		}
	}
	return variants;
}

/**
 * GET /api/v1/images/search
 * 搜尋圖片
 * Query parameters:
 * - q: 搜尋關鍵字 (必填)
 * - fuzzy: 是否啟用模糊搜尋 (true/false, 預設false)
 * - page: 頁碼 (預設1)
 * - limit: 每頁數量 (預設20)
 */
export default defineEventHandler(async (event) => {
	try {
		const data_mapping = await getJsonData();
		const query = getQuery(event);
		const queryKeyword: string = query.q as string || query.keyword as string || '';
		const page = parseInt(query.page as string) || 1;
		const limit = parseInt(query.limit as string) || 20;
		const fuzzy = query.fuzzy === 'true';

		if (!queryKeyword.trim()) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Search query is required. Use "q" parameter.'
			});
		}

		const keyword = converter(queryKeyword);
		const keywords: string[] = keyword.split(' ');

		let scoredResults: Array<{ url: string; alt: string; score: number; id: string; author?: string; episode?: string }> = [];
		let fullMatchResults: Array<{ url: string; alt: string; score: number; id: string; author?: string; episode?: string }> = [];
		const customKeymapResults: Array<{ url: string; alt: string; score: number; id: string; author?: string; episode?: string }> = [];

		data_mapping.forEach((item, index) => {
			const name = item.alt;
			let totalScore = 0;

			for (const keyword of keywords) {
				const variants = fuzzy ? generateFuzzyVariants(keyword) : new Set([keyword]);
				let matched = false;

				for (const variant of variants) {
					if (name.includes(variant)) {
						totalScore += variant.length >= 2 ? 10 : 5;
						matched = true;
						break;
					}

					if (fuzzy && variant.length > 2 && name.length > 2) {
						const dist = leven_distance(variant, name);
						const ratio = (variant.length - dist) / variant.length;
						if (dist <= 2 && ratio >= 0.5) {
							totalScore += 3;
							matched = true;
							break;
						}
					}
				}

				if (!matched) {
					totalScore = 0;
					break;
				}
			}

			const imageItem = {
				id: index.toString(),
				url: baseURL + item.filename,
				alt: item.alt,
				author: item.author,
				episode: item.episode,
				score: totalScore
			};

			if (totalScore > 0) {
				scoredResults.push(imageItem);
			}

			// 精準匹配
			if (keywords.some(k => name.includes(k))) {
				fullMatchResults.push({ ...imageItem, score: 15 });
			}
		});

		// 自定義關鍵字映射
		if (custom_keymap.hasOwnProperty(keyword)) {
			const keywordValue = custom_keymap[keyword]?.value || [];
			data_mapping.forEach((item, index) => {
				if (keywordValue.includes(item.alt)) {
					customKeymapResults.push({
						id: index.toString(),
						url: baseURL + item.filename,
						alt: item.alt,
						author: item.author,
						episode: item.episode,
						score: 15,
					});
				}
			});
		}

		// 合併結果並去重
		const combinedResultsMap = new Map<string, any>();
		[...scoredResults, ...fullMatchResults, ...customKeymapResults].forEach((result) => {
			combinedResultsMap.set(result.url, result);
		});

		const sortedResults = Array.from(combinedResultsMap.values())
			.sort((a, b) => b.score - a.score);

		// 分頁
		const offset = (page - 1) * limit;
		const paginatedResults = sortedResults.slice(offset, offset + limit);
		const totalCount = sortedResults.length;
		const totalPages = Math.ceil(totalCount / limit);

		return {
			data: paginatedResults.map(({ score, ...item }) => item), // 移除score
			meta: {
				query: queryKeyword,
				fuzzy,
				total: totalCount,
				page,
				limit,
				totalPages,
				hasNext: page < totalPages,
				hasPrev: page > 1
			}
		};

	} catch (error: any) {
		if (error.statusCode) {
			throw error;
		}
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to search images'
		});
	}
});
