import { describe, expect, test } from 'vitest'
import { createImageUrlResolver } from '../server/utils/imageUrlResolver'

describe('createImageUrlResolver', () => {
  const resolve = createImageUrlResolver('https://cdn.example.test/f/')

  test('保留外部圖源提供的 absolute URL', () => {
    expect(resolve({ alt: 'external', url: 'https://other.example/image.jpg' }))
      .toBe('https://other.example/image.jpg')
  })

  test('保留 data、blob 等非 HTTP URI scheme', () => {
    expect(resolve({ alt: 'inline', url: 'data:image/gif;base64,AAAA' }))
      .toBe('data:image/gif;base64,AAAA')
    expect(resolve({ alt: 'blob', url: 'blob:https://app.example/id' }))
      .toBe('blob:https://app.example/id')
  })

  test('只對相對 storage path 套用 configured base URL', () => {
    expect(resolve({ alt: 'managed', storagePath: '/uuid.jpg' }))
      .toBe('https://cdn.example.test/f/uuid.jpg')
  })
})
