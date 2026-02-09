import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { SemanticSearchService } from '../../../server/services/semanticSearchService'
import { existsSync, writeFileSync } from 'node:fs'

// Mock dependencies
vi.mock('@huggingface/transformers', () => ({
  pipeline: vi.fn().mockResolvedValue((_text: string | string[]) => {
    // Return a dummy embedding
    const embedding = new Float32Array(384).fill(0.1)
    return { data: embedding }
  }),
  env: {},
}))

vi.mock('node:fs', () => {
  return {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  }
})

describe('SemanticSearchService', () => {
  let service: SemanticSearchService

  beforeEach(() => {
    // Reset singleton instance by dealing with private property if possible or just get instance
    // Since it's a singleton, we might affect other tests if not careful.
    // Ideally we would reset the instance, but it's private.
    // We can rely on basic state reset or just testing behavior.
    service = SemanticSearchService.getInstance()
    vi.clearAllMocks()
  })

  it('should be a singleton', () => {
    const instance1 = SemanticSearchService.getInstance()
    const instance2 = SemanticSearchService.getInstance()
    expect(instance1).toBe(instance2)
  })

  it('should build index', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockData: any[] = [
      { alt: 'Test Image 1', description: 'Description 1' },
      { alt: 'Test Image 2', description: 'Description 2' },
    ];

    // Mock fs to simulate no cache
    (existsSync as unknown as Mock).mockReturnValue(false)

    await service.buildIndex(mockData)

    // Check if index size matches
    // We need to access private property 'index' or check behavior via search
    // Since we can't easily access private props in TS without casting to any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((service as any).index.length).toBe(2)
    expect(writeFileSync).toHaveBeenCalled()
  })

  it('should search successfully', async () => {
    // Ensure index is built
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockData: any[] = [
      { alt: 'Find Me', description: 'Target' },
      { alt: 'Ignore Me', description: 'Noise' },
    ];
    (existsSync as unknown as Mock).mockReturnValue(false)
    await service.buildIndex(mockData)

    const results = await service.search('Find', mockData)

    // Since our mock embedding returns same vector for everything,
    // cosine similarity will be 1.0 for all.
    // Filter logic might rely on keyword match if score is tied or high enough.
    // Wait, processSearchKeyword and findMatches are real.

    expect(results).toBeDefined()
    // Expect some results
    expect(results.length).toBeGreaterThan(0)
  })
})
