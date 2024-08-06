// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  rules: [
    // Define a custom rule for your Nerd Font
    ['nerd', { 'font-family': '"FiraCode Nerd Font", monospace' }],
    // defile custom text color by regex
    [/^color-([a-z\d]+)$/, ([_, value]) => ({ color: `#${value}` })],

  ],
  theme: {
    colors: {
      'tggray': {
        50: '#1e1e1e',
        75: '#232323',
        100: '#2a2a2a',
        200: '#2f2f2f',
        300: '#3e3e3e',
        400: '#505050',
        500: '#b4b4b4',
        600: '#dcdcdc',
        700: '#f5f5f5',
        800: '#fafafa',
        900: '#fff',
      }
    }
  }
})