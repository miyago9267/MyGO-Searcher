import { readFileSync } from 'fs';
import { join } from 'path';

export const jsonData = (() => {
  const dataPath = join(process.cwd(), 'data', 'image_map.json');
  return JSON.parse(readFileSync(dataPath, 'utf-8'));
})();

export const customKeyMap = (() => {
  const dataPath = join(process.cwd(), 'data', 'custom_keymap.json');
  return JSON.parse(readFileSync(dataPath, 'utf-8'));
})();