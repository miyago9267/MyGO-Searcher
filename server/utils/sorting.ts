export type SortOrder = 'id' | 'random' | 'episode' | 'alphabetical' | 'popularity';

interface SortableImage {
	id?: string | number;
	alt?: string;
	episode?: string;
	popularity?: number;
}

/**
 * 對圖片陣列進行排序
 * @param allImages - 要排序的圖片陣列
 * @param order - 排序方式
 * @returns Promise<ImageItem[]> - 排序後的圖片陣列
 */

export async function sortImages<T extends SortableImage>(allImages: T[], order: SortOrder = 'id'): Promise<T[]> {
	return new Promise((resolve) => {
		const sortedImages = allImages.sort((a, b) => {
			if (order === 'id') {
				const aId = String(a.id ?? '')
				const bId = String(b.id ?? '')
				const aNumber = Number(aId)
				const bNumber = Number(bId)

				if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) {
					return aNumber - bNumber
				}

				return aId.localeCompare(bId, 'en', { numeric: true })
			} else if (order === 'random') {
				// 隨機排序
				return Math.random() - 0.5;
			} else if (order === 'episode') {
				// 集數排序：mygo_x 優先於 mujica_x
				const aEpisode = a.episode || '';
				const bEpisode = b.episode || '';
				
				// 解析集數信息
				const parseEpisode = (episode: string) => {
					const match = episode.match(/^(mygo|mujica)_(\d+)$/);
					if (!match) return { series: 'zzz', number: 0 }; // 未知的放最後
					return {
						series: match[1] === 'mygo' ? 'a' : 'b', // mygo 優先
						number: parseInt(match[2])
					};
				};
				
				const aParsed = parseEpisode(aEpisode);
				const bParsed = parseEpisode(bEpisode);
				
				// 先按系列排序（mygo 優先），再按集數排序
				if (aParsed.series !== bParsed.series) {
					return aParsed.series.localeCompare(bParsed.series);
				}
				return aParsed.number - bParsed.number;
			} else if (order === 'alphabetical') {
				// 字典序排序（按 alt 屬性）
				const aAlt = a.alt || '';
				const bAlt = b.alt || '';
				return aAlt.localeCompare(bAlt, 'zh', { numeric: true });
			} else if (order === 'popularity') {
				// 人氣排序（人氣高的在前面）
				const aPopularity = a.popularity || 0;
				const bPopularity = b.popularity || 0;
				return bPopularity - aPopularity; // 降序排列
			} else {
				return 0; // 默認不排序
			}
		});
		
		resolve(sortedImages);
	});
}
