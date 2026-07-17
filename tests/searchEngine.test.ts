import { describe, expect, test } from 'bun:test'
import { SearchEngine } from '../server/utils/search/searchEngine'

describe('SearchEngine', () => {
  const data = [
    {
      id: 7,
      alt: '一起組一輩子的樂團',
      description: '燈在天文館說出的願望',
      author: '燈',
      tags: ['天文館', 'MyGO'],
      episode: 'mygo_3',
      url: 'https://images.example.test/tomori.jpg'
    },
    {
      id: 8,
      alt: '客服小祥',
      author: '祥子',
      tags: ['客服'],
      episode: 'mujica_4',
      storagePath: '/uuid.jpg'
    }
  ]

  test('只排序 metadata，不改寫或依賴圖源 URL', async () => {
    const [result] = await new SearchEngine().searchInData(data, '天文館')

    expect(result.id).toBe('7')
    expect(result.image).toBe(data[0])
    expect(result).not.toHaveProperty('url')
  })

  test('可搜尋人物與 tags', async () => {
    const authorResults = await new SearchEngine().searchInData(data, '祥子')
    const tagResults = await new SearchEngine().searchInData(data, '客服')

    expect(authorResults.map(item => item.id)).toEqual(['8'])
    expect(tagResults.map(item => item.id)).toEqual(['8'])
  })

  test('custom key map 是可選的同義詞來源', async () => {
    const engine = new SearchEngine({ 小客服: { value: ['客服小祥'] } })
    const results = await engine.searchInData(data, '小客服')

    expect(results[0].id).toBe('8')
  })

  test('標題命中優先於多個 secondary metadata 命中', async () => {
    const results = await new SearchEngine().searchInData([
      { id: 'title', alt: '關鍵字', description: '其他內容' },
      { id: 'metadata', alt: '其他標題', description: '關鍵字', author: '關鍵字', tags: ['關鍵字'] }
    ], '關鍵字')

    expect(results.map(item => item.id)).toEqual(['title', 'metadata'])
  })
})
