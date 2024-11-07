import { jsonData } from '../../utils/dataLoader';
import { defineEventHandler } from 'h3';
import {leven_distance}  from '../../algo/levenshtein';

const baseURL = 'https://drive.miyago9267.com/d/file/img/mygo/';
const data_mapping = Array.isArray(jsonData) ? jsonData : [];

const fuzzyReplacements: Record<string, string[]> = {
  "你": ["姊"],
  "姊": ["你"],
  "他": ["她"],
  "她": ["他"],
  "欽": ["耶"],
  "耶": ["欽"],
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

function calculateScore(keyword: string, text: string): number {
  if (keyword === text) {
    return 15; // High score for exact match
  }

  let score = 0;
  if (text.includes(keyword)) {
    score += 5; // Lower base score for containing substring, especially for short keywords
  }

  let maxContinuousMatch = 0;
  for (let i = 0; i < keyword.length; i++) {
    for (let j = i + 1; j <= keyword.length; j++) {
      if (text.includes(keyword.substring(i, j))) {
        maxContinuousMatch = Math.max(maxContinuousMatch, j - i);
      }
    }
  }

  if (maxContinuousMatch > 1) {
    score += maxContinuousMatch;
  }

  return score;
}

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const keyword: string = query.keyword as string ?? '';
  const keywords: string[] = keyword.split(' ');
  const fuzzy = query.fuzzy === 'true';

  let scoredResults: Array<{ url: string; alt: string; score: number }> = [];
  let fullMatchResults: Array<{ url: string; alt: string; score: number }> = [];

  for (const item of data_mapping) {
    const name = item.name;
    let totalScore = 0;
    let keywordFullyMatched = true;

    for (const keyword of keywords) {
      const fuzzyVariants = fuzzy ? generateFuzzyVariants(keyword) : new Set([keyword]);
      let maxScoreForKeyword = 0;
      let keywordMatched = false;

      for (const variant of fuzzyVariants) {
        if (!fuzzy) {
          if (name.includes(variant)) {
            maxScoreForKeyword = 15; // High score for exact match
            keywordMatched = true;
            break;
          }
        } else {
          if (name.includes(variant)) {
            maxScoreForKeyword = Math.max(maxScoreForKeyword, 10);
            keywordMatched = true;
          } else if (variant.length > 2 && name.length > 2 && leven_distance(variant, name) <= 2) {
            const similarityRatio = (variant.length - leven_distance(variant, name)) / variant.length;
            if (similarityRatio >= 0.5 && name.includes(variant)) {
              maxScoreForKeyword = Math.max(maxScoreForKeyword, 3);
              keywordMatched = true;
            }
          }
        }
      }

      if (maxScoreForKeyword > 0) {
        totalScore += maxScoreForKeyword;
      } else {
        keywordFullyMatched = false;
        break;
      }
    }

    if (totalScore > 0) {
      scoredResults.push({ url: baseURL + item.file_name, alt: item.name, score: totalScore });
    }

    for (const keyword of keywords) {
      if (name.includes(keyword)) {
        fullMatchResults.push({ url: baseURL + item.file_name, alt: item.name, score: 15 });
        break;
      }
    }
  }

  // Merge scored results and full match results, remove duplicates
  const combinedResultsMap = new Map<string, { url: string; alt: string; score: number }>();
  [...scoredResults, ...fullMatchResults].forEach((result) => {
    combinedResultsMap.set(result.url, result);
  });

  const sortedResults = Array.from(combinedResultsMap.values()).sort((a, b) => b.score - a.score);

  return { urls: sortedResults };
});
