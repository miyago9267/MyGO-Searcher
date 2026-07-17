import { describe, expect, test } from 'bun:test'
import { SearchService } from '../server/services/searchService'

describe('SearchService', () => {
  test('可注入外部 data source 與 URL resolver', async () => {
    const dataSource = {
      async getSearchData() {
        return [{ id: 'external-1', alt: '外部來源圖片', url: 'asset://image-1' }]
      }
    }
    const service = new SearchService({
      dataSource,
      resolveImageUrl: image => image.url!.replace('asset://', 'https://cdn.partner.test/')
    })

    const response = await service.search({
      query: '外部來源',
      fuzzy: false,
      page: 1,
      limit: 20,
      order: 'id'
    })

    expect(response.data).toEqual([{
      id: 'external-1',
      url: 'https://cdn.partner.test/image-1',
      alt: '外部來源圖片',
      author: undefined,
      episode: undefined
    }])
  })
})
