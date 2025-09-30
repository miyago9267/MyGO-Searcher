import { defineConfig, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'
import { presetWind3 } from '@unocss/preset-wind3'

export default defineConfig({
  presets: [
    presetWind3({ dark: 'class' }),
    presetIcons(),
  ],
  rules: [
    [/^bg-color-([a-z\d]+)$/, ([_, value]) => ({ 'background-color': `#${value}` })],
    [/^color-([a-z\d]+)$/, ([_, value]) => ({ color: `#${value}` })],
    [/^fs-(\d+px)$/, ([_, value]) => ({ 'font-size': value })],
    [/^wp-([0-9]+)$/, ([_, value]) => ({ width: `${value}%` })],
    [/^hp-([0-9]+)$/, ([_, value]) => ({ height: `${value}%` })],
    [/^main$/, () => ({ height: 'calc(100vh - 60px)' })],
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      tggray: {
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
      },
    },
  },
})
