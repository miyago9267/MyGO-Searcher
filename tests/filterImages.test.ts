import { describe, expect, test } from 'vitest'
import { filterImages } from '../app/utils/filterImages'

const images = [
  { id: '1', url: '/1.jpg', alt: 'mygo', episode: 'mygo_1', author: '燈', tags: ['愛音'] },
  { id: '2', url: '/2.jpg', alt: 'mujica', episode: 'mujica_2', author: '祥子', tags: ['睦'] },
]

describe('filterImages', () => {
  test('MyGO 與 Mujica 集數合併為 OR 條件', () => {
    const result = filterImages(images, {
      MyGO集數: ['mygo_1'],
      AveMujica集數: ['mujica_2'],
      人物: [],
    })

    expect(result).toHaveLength(2)
  })

  test('人物可匹配 author 或 tags，並與集數使用 AND', () => {
    const result = filterImages(images, {
      MyGO集數: ['mygo_1'],
      AveMujica集數: [],
      人物: ['愛音'],
    })

    expect(result.map(item => item.id)).toEqual(['1'])
  })
})
