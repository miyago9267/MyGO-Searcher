import { leven_distance } from '../../algo/levenshtein'
import * as OpenCC from 'opencc-js'
import type { MatchInfo } from '../../types/search'

// 初始化雙向轉換器
const converterToTW = OpenCC.Converter({ from: 'cn', to: 'tw' })
const converterToCN = OpenCC.Converter({ from: 'tw', to: 'cn' })

// 擴展的模糊替換規則
const fuzzyReplacements: Record<string, string[]> = {
  你: ['姊', '妳'],
  姊: ['你', '妳'],
  妳: ['你', '姊'],
  他: ['她', '它'],
  她: ['他', '它'],
  它: ['他', '她'],
  欸: ['耶', '誒', '诶'],
  耶: ['欸', '誒', '诶'],
  誒: ['欸', '耶', '诶'],
  诶: ['欸', '耶', '誒'],
  的: ['得', '地'],
  得: ['的', '地'],
  地: ['的', '得'],
  嗎: ['吗', '麼', '么'],
  吗: ['嗎', '麼', '么'],
  麼: ['嗎', '吗', '么'],
  么: ['嗎', '吗', '麼'],
}

/**
 * 生成模糊匹配的變體
 */
export function generateFuzzyVariants(keyword: string): Set<string> {
  const variants = new Set<string>([keyword])
  for (let i = 0; i < keyword.length; i++) {
    const char = keyword[i]
    if (char && fuzzyReplacements[char]) {
      for (const replacement of fuzzyReplacements[char]) {
        const newVariant = keyword.substring(0, i) + replacement + keyword.substring(i + 1)
        variants.add(newVariant)
      }
    }
  }
  return variants
}

/**
 * 處理搜索關鍵詞 - 支援繁簡雙向
 */
export function processSearchKeyword(queryKeyword: string): string[] {
  // 生成繁簡兩個版本
  const twVersion = converterToTW(queryKeyword) as string
  const cnVersion = converterToCN(queryKeyword) as string

  // 合併並去重
  const keywords = new Set<string>()

  // 添加原始關鍵字
  queryKeyword.split(' ').filter((k: string) => k.trim()).forEach((k: string) => keywords.add(k))

  // 添加繁體版本
  twVersion.split(' ').filter((k: string) => k.trim()).forEach((k: string) => keywords.add(k))

  // 添加簡體版本
  cnVersion.split(' ').filter((k: string) => k.trim()).forEach((k: string) => keywords.add(k))

  return Array.from(keywords)
}

/**
 * 尋找文字中的所有匹配位置
 */
export function findMatches(
  text: string,
  keywords: string[],
  fuzzy: boolean = false,
): MatchInfo[] {
  const matches: MatchInfo[] = []
  const lowerText = text.toLowerCase()

  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase()
    const variants = fuzzy ? generateFuzzyVariants(lowerKeyword) : new Set([lowerKeyword])

    for (const variant of variants) {
      // 尋找所有出現位置
      let startIndex = 0
      while (startIndex < lowerText.length) {
        const index = lowerText.indexOf(variant, startIndex)
        if (index === -1) break

        const matchType = variant === lowerKeyword ? 'exact' : 'variant'
        matches.push({
          text: text.substring(index, index + variant.length),
          startIndex: index,
          endIndex: index + variant.length,
          matchType,
        })

        startIndex = index + 1
      }
    }
  }

  // 去重並排序
  const uniqueMatches = new Map<string, MatchInfo>()
  matches.forEach((match) => {
    const key = `${match.startIndex}-${match.endIndex}`
    if (!uniqueMatches.has(key)) {
      uniqueMatches.set(key, match)
    }
  })

  return Array.from(uniqueMatches.values()).sort((a, b) => a.startIndex - b.startIndex)
}

/**
 * 計算關鍵詞匹配分數
 */
export function calculateMatchScore(
  text: string,
  keyword: string,
  fuzzy: boolean = false,
): { score: number, matched: boolean, matches: MatchInfo[] } {
  const lowerText = text.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()
  const variants = fuzzy ? generateFuzzyVariants(lowerKeyword) : new Set([lowerKeyword])
  const matches: MatchInfo[] = []

  for (const variant of variants) {
    // 完全包含匹配
    const index = lowerText.indexOf(variant)
    if (index !== -1) {
      matches.push({
        text: text.substring(index, index + variant.length),
        startIndex: index,
        endIndex: index + variant.length,
        matchType: variant === lowerKeyword ? 'exact' : 'variant',
      })

      return {
        score: variant.length >= 2 ? 10 : 5,
        matched: true,
        matches,
      }
    }

    // 模糊匹配 - 只對長字串使用
    if (fuzzy && variant.length > 2 && lowerText.length > 2) {
      const dist = leven_distance(variant, lowerText)
      const ratio = (variant.length - dist) / variant.length
      if (dist <= 2 && ratio >= 0.8) {
        matches.push({
          text: text,
          startIndex: 0,
          endIndex: text.length,
          matchType: 'fuzzy',
        })

        return {
          score: 3,
          matched: true,
          matches,
        }
      }
    }
  }

  return { score: 0, matched: false, matches: [] }
}

/**
 * 計算文本與多個關鍵詞的總分數
 */
export function calculateTotalScore(
  text: string,
  keywords: string[],
  fuzzy: boolean = false,
): { score: number, matches: MatchInfo[] } {
  let totalScore = 0
  let matchedCount = 0
  const allMatches: MatchInfo[] = []

  for (const keyword of keywords) {
    const { score, matched, matches } = calculateMatchScore(text, keyword, fuzzy)
    if (matched) {
      totalScore += score
      matchedCount++
      allMatches.push(...matches)
    }
  }

  // 去重匹配
  const uniqueMatches = new Map<string, MatchInfo>()
  allMatches.forEach((match) => {
    const key = `${match.startIndex}-${match.endIndex}`
    if (!uniqueMatches.has(key)) {
      uniqueMatches.set(key, match)
    }
  })

  return {
    score: matchedCount > 0 ? totalScore : 0,
    matches: Array.from(uniqueMatches.values()).sort((a, b) => a.startIndex - b.startIndex),
  }
}

/**
 * 檢查是否為精準匹配
 */
export function isExactMatch(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase()
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))
}
