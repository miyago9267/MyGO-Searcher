import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
  ],
  base: './',
  build: {
    // 設定構建輸出目錄
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    'process.env': process.env,
  },
})