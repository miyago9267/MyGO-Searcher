import { describe, expect, test } from 'vitest'
import { sortImages } from '../server/utils/sorting'

describe('sortImages', () => {
  test('id 排序同時支援 numeric 與 external string ID', async () => {
    const numeric = await sortImages([{ id: '10' }, { id: '2' }], 'id')
    const external = await sortImages([{ id: 'external-10' }, { id: 'external-2' }], 'id')

    expect(numeric.map(item => item.id)).toEqual(['2', '10'])
    expect(external.map(item => item.id)).toEqual(['external-2', 'external-10'])
  })
})
