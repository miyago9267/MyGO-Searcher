import { describe, test, expect } from 'bun:test';
import { getProcessedImageDataSync, storageHref } from '../server/utils/dataProcessing';

const base = { id: 1, alt: '我也一樣', description: '', tags: [], author: '', popularity: 0 };

describe('resolveItem (via getProcessedImageDataSync)', () => {
  test('沒有 key 時退回 episode 推導路徑，filename 不被改寫', () => {
    const [item] = getProcessedImageDataSync([
      { ...base, episode: 'mygo_11', filename: '我也一樣.jpg' },
    ]);
    expect(item.storagePath).toBe('/mygo/11/我也一樣.jpg');
    expect(item.filename).toBe('我也一樣.jpg');
  });

  test('有 key 時 key 優先，episode 只當分類、不影響定址', () => {
    const [item] = getProcessedImageDataSync([
      { ...base, episode: 'mygo_11', filename: '我也一樣.jpg', key: 'aaaa1111-uuid.jpg' },
    ]);
    expect(item.storagePath).toBe('/aaaa1111-uuid.jpg');
    expect(item.filename).toBe('我也一樣.jpg');
    expect(item.episode).toBe('mygo_11');
  });

  test('key 已帶頭斜線就不重複加', () => {
    const [item] = getProcessedImageDataSync([
      { ...base, episode: 'mygo_11', filename: 'x.jpg', key: '/pre/fixed.jpg' },
    ]);
    expect(item.storagePath).toBe('/pre/fixed.jpg');
  });

  test('key 存在時不依賴 episode（解耦的核心語意）', () => {
    const [item] = getProcessedImageDataSync([
      { ...base, filename: 'x.jpg', key: 'solo-key.jpg' },
    ]);
    expect(item.storagePath).toBe('/solo-key.jpg');
  });

  test('非字串或空白 key 視為沒有，退回 episode 推導', () => {
    const cases = [12345, '', '   ', null, { nested: true }];
    for (const bad of cases) {
      const [item] = getProcessedImageDataSync([
        { ...base, episode: 'mujica_9', filename: 'y.jpg', key: bad as any },
      ]);
      expect(item.storagePath).toBe('/mujica/9/y.jpg');
    }
  });

  test('episode 與 key 都沒有時項目原樣通過，不拋錯', () => {
    const raw = { ...base, filename: 'z.jpg' };
    const [item] = getProcessedImageDataSync([raw]);
    expect(item.storagePath).toBeUndefined();
    expect(item.filename).toBe('z.jpg');
  });
});

describe('storageHref', () => {
  test('優先取 storagePath', () => {
    expect(storageHref({ storagePath: '/k.jpg', filename: 'f.jpg' })).toBe('/k.jpg');
  });

  test('無 storagePath 時退回 filename，再退回 file_name（legacy）', () => {
    expect(storageHref({ filename: '/mygo/1/f.jpg' })).toBe('/mygo/1/f.jpg');
    expect(storageHref({ file_name: '/legacy.jpg' })).toBe('/legacy.jpg');
    expect(storageHref({})).toBe('');
  });
});
