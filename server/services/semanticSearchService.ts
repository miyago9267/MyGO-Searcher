import { pipeline, env } from '@huggingface/transformers'
import type { ImageData, SearchResult } from '../types'
import { processSearchKeyword, findMatches } from '../utils/search/searchAlgorithm'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { createHash } from 'node:crypto'



/**
 * 實驗性語義搜尋服務
 * 使用 Transformers.js (EmbeddingGemma) 進行服務端推論
 */
export class SemanticSearchService {
  private static instance: SemanticSearchService
  private extractor: any = null
  private modelId = 'onnx-community/embeddinggemma-300m-ONNX'
  private index: { id: string; embedding: number[]; item: ImageData }[] = []
  private isInitialized = false
  private isBuildingIndex = false
  private cacheDir = resolve(process.cwd(), 'node_modules/.cache')
  private cacheFile = join(this.cacheDir, 'semantic-search-index.json')

  private constructor() {}

  public static getInstance(): SemanticSearchService {
    if (!SemanticSearchService.instance) {
      SemanticSearchService.instance = new SemanticSearchService()
    }
    return SemanticSearchService.instance
  }

  /**
   * 初始化模型
   */
  private async initialize() {
    if (this.extractor) return

    console.log('[SemanticSearch] Loading model:', this.modelId)
    this.extractor = await pipeline('feature-extraction', this.modelId, {
      dtype: 'q8', 
    })
    console.log('[SemanticSearch] Model loaded')
    this.isInitialized = true
  }

  /**
   * 計算 Embeddings
   */
  private async computeEmbedding(text: string): Promise<number[]> {
    if (!this.extractor) await this.initialize()



    const output = await this.extractor(text, { pooling: 'mean', normalize: true })
    return Array.from(output.data)
  }

  /**
   * 建立索引 (預計算所有數據的 Embeddings)
   */
  public async buildIndex(data: ImageData[]) {
    if (this.isBuildingIndex || this.index.length === data.length) return
    
    const dataHash = this.computeDataHash(data)
    
    try {
      if (existsSync(this.cacheFile)) {
        const cacheRaw = readFileSync(this.cacheFile, 'utf-8')
        const cache = JSON.parse(cacheRaw)
        
        if (cache.hash === dataHash && Array.isArray(cache.index)) {
          console.log('[SemanticSearch] Loading index from cache')
          this.index = cache.index
          return
        }
      }
    } catch (e) {
      console.warn('[SemanticSearch] Failed to load cache', e)
    }

    if (!this.extractor) await this.initialize()

    console.log('[SemanticSearch] Building index for', data.length, 'items...')
    this.isBuildingIndex = true

    try {
      this.index = []

      const prefixes = { document: 'title: none | text: ' }

      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (!item) continue

        const textContent = `${item.alt} ${item.description || ''} ${item.tags?.join(' ') || ''}`.trim()
        
        const input = prefixes.document + textContent
        
        const embedding = await this.computeEmbedding(input)
        
        this.index.push({
          id: String(i), 
          embedding,
          item,
        })

        if ((i + 1) % 50 === 0) {
          console.log(`[SemanticSearch] Indexed ${i + 1}/${data.length} items`)
        }
      }

      console.log('[SemanticSearch] Index built successfully')
      
      try {
        if (!existsSync(this.cacheDir)) {
          mkdirSync(this.cacheDir, { recursive: true })
        }
        writeFileSync(this.cacheFile, JSON.stringify({
          hash: dataHash,
          index: this.index
        }))
        console.log('[SemanticSearch] Index cached')
      } catch (e) {
        console.warn('[SemanticSearch] Failed to save cache', e)
      }

    } catch (error) {
      console.error('[SemanticSearch] Failed to build index:', error)
    } finally {
      this.isBuildingIndex = false
    }
  }

  /**
   * 計算資料雜湊值以驗證快取
   */
  private computeDataHash(data: ImageData[]): string {
    return createHash('md5').update(JSON.stringify(data)).digest('hex')
  }

  /**
   * 執行語義搜尋
   */
  public async search(query: string, data: ImageData[], limit: number = 20, minScore: number = 0.65): Promise<SearchResult[]> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (this.index.length === 0 && data.length > 0) {
      await this.buildIndex(data)
    }

    if (this.index.length === 0) {
      return []
    }

    const prefixes = { query: 'task: search result | query: ' } 
    const queryInput = prefixes.query + query
    const queryEmbedding = await this.computeEmbedding(queryInput)

    const scored = this.index.map((entry) => {
      const score = this.cosineSimilarity(queryEmbedding, entry.embedding)
      return { ...entry, score }
    })

    const searchKeywords = processSearchKeyword(query)

    const results = scored
      .filter((entry) => entry.score >= minScore) 
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry) => {
        const { item, score } = entry
        
        const matches = findMatches(
          `${item.alt} ${item.description || ''}`, 
          searchKeywords, 
          true 
        )

        return {
          id: entry.id,
          url: (process.env.NUXT_IMG_BASE_URL || '') + (item.filename || item.file_name || ''),
          alt: item.alt,
          author: item.author,
          episode: item.episode,
          score: score,
          matches: matches.length > 0 ? matches : undefined
        } as SearchResult
      })

    return results
  }

  /**
   * Cosine Similarity
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0
    let normA = 0
    let normB = 0
    const len = Math.min(a.length, b.length)
    
    for (let i = 0; i < len; i++) {
      const valA = a[i] ?? 0
      const valB = b[i] ?? 0
      dotProduct += valA * valB
      normA += valA * valA
      normB += valB * valB
    }
    
    if (normA === 0 || normB === 0) return 0
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
}
