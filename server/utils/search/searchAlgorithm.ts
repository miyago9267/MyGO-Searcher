import { leven_distance } from '../../algo/levenshtein'
import * as OpenCC from 'opencc-js'

// 初始化轉換器
const converter = OpenCC.Converter({ from: 'cn', to: 'tw' })

// 模糊替換規則
const fuzzyReplacements: Record<string, string[]> = {
  你: ['姊'],
  姊: ['你'],
  他: ['她'],
  她: ['他'],
  欸: ['耶'],
  耶: ['欸'],
}

/**
 * 生成模糊匹配的變體
 */
export function generateFuzzyVariants(keyword: string): Set<string> {
  const variants = new Set<string>([keyword])
  for (let i = 0; i < keyword.length; i++) {
    const char = keyword[i]
    if (fuzzyReplacements[char]) {
      for (const replacement of fuzzyReplacements[char]) {
        const newVariant = keyword.substring(0, i) + replacement + keyword.substring(i + 1)
        variants.add(newVariant)
      }
    }
  }
  return variants
}

/**
 * 處理搜索關鍵詞
 */
export function processSearchKeyword(queryKeyword: string): string[] {
  const keyword = converter(queryKeyword)
  return keyword.split(' ').filter(k => k.trim())
}

/**
 * 計算關鍵詞匹配分數
 */
export function calculateMatchScore(
  text: string,
  keyword: string,
  fuzzy: boolean = false,
): { score: number, matched: boolean } {
  // 轉換為小寫進行比較
  const lowerText = text.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()
  const variants = fuzzy ? generateFuzzyVariants(lowerKeyword) : new Set([lowerKeyword])

  for (const variant of variants) {
    // 完全包含匹配
    if (lowerText.includes(variant)) {
      return {
        score: variant.length >= 2 ? 10 : 5,
        matched: true,
      }
    }

    // 模糊匹配
    if (fuzzy && variant.length > 2 && lowerText.length > 2) {
      const dist = leven_distance(variant, lowerText)
      const ratio = (variant.length - dist) / variant.length
      if (dist <= 2 && ratio >= 0.5) {
        return {
          score: 3,
          matched: true,
        }
      }
    }
  }

  return { score: 0, matched: false }
}

/**
 * 計算文本與多個關鍵詞的總分數
 */
export function calculateTotalScore(
  text: string,
  keywords: string[],
  fuzzy: boolean = false,
): number {
  let totalScore = 0
  let matchedCount = 0

  for (const keyword of keywords) {
    const { score, matched } = calculateMatchScore(text, keyword, fuzzy)
    if (matched) {
      totalScore += score
      matchedCount++
    }
  }

  // 如果沒有任何關鍵詞匹配，返回0
  // 如果有匹配，返回總分數
  return matchedCount > 0 ? totalScore : 0
}

/**
 * 檢查是否為精準匹配
 */
export function isExactMatch(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase()
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))
}
