import { jsonData, customKeyMap } from '../../utils/dataLoader';
import { leven_distance }  from '../../algo/levenshtein';
import * as OpenCC from 'opencc-js';
import { defineEventHandler } from 'h3';

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

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const queryKeyword: string = query.keyword as string ?? '';
  const keyword = converter(queryKeyword)
  const keywords: string[] = keyword.split(' ');
  const fuzzy = query.fuzzy === 'true';

  let scoredResults: Array<{ url: string; alt: string; score: number }> = [];
  let fullMatchResults: Array<{ url: string; alt: string; score: number }> = [];
  const customKeymapResults: Array<{ url: string; alt: string; score: number }> = [];

  for (const item of data_mapping) {
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

    if (totalScore > 0) {
      scoredResults.push({ url: baseURL + item.filename, alt: item.alt, score: totalScore });
    }

    // 保留精準匹配（不重複）
    if (keywords.some(k => name.includes(k))) {
      fullMatchResults.push({ url: baseURL + item.filename, alt: item.alt, score: 15 });
    }
  }

  if (custom_keymap.hasOwnProperty(keyword)) {
    const keywordValue = custom_keymap[keyword]?.value || [];
    customKeymapResults.push(
      ...data_mapping
        .filter((item) => keywordValue.includes(item.alt))
        .map((item) => ({
          url: baseURL + item.filename,
          alt: item.alt,
          score: 15,
        }))
    );
  }

  // Merge scored results and full match results, remove duplicates
  const combinedResultsMap = new Map<string, { url: string; alt: string; score: number }>();
  [...scoredResults, ...fullMatchResults, ...customKeymapResults].forEach((result) => {
    combinedResultsMap.set(result.url, result);
  });

  const sortedResults = Array.from(combinedResultsMap.values()).sort((a, b) => b.score - a.score);

  return { urls: sortedResults };
  
});
