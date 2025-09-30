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
})
