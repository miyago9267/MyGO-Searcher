// Nuxt 4 ESLint config
// Nuxt 4 ESLint config – tailored to Miyago's style (TS uses tabs, semicolons, relaxed Vue rules)
import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt({
  features: {
    stylistic: true, // keep base rules, override below
    typescript: true,
  },
  rules: {
    // --- Indentation & tabs ---
    '@stylistic/indent': ['error', 'tab', { SwitchCase: 1 }],
    '@stylistic/no-tabs': 'off',

    // --- Semicolons & quotes ---
    '@stylistic/semi': ['error', 'always'], // keep semicolons
    '@stylistic/quotes': 'off', // don't enforce single/double

    // --- Commas / trailing / spacing niceties ---
    '@stylistic/comma-dangle': ['off', 'never'],
    '@stylistic/object-curly-spacing': 'off',
    '@stylistic/no-multi-spaces': 'off',
    '@stylistic/eol-last': 'off',

    // --- TS specifics ---
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: { delimiter: 'semi', requireLast: true },
        singleline: { delimiter: 'semi', requireLast: true },
      },
    ],

    // --- Vue SFC rules (relax HTML formatting) ---
    // Indentation is configured in overrides for .vue files (4 spaces)
    'vue/html-indent': 'off',
    'vue/script-indent': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/attributes-order': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/block-tag-newline': 'off',
    'vue/valid-template-root': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/require-explicit-emits': 'off',

    // --- Nuxt & general tweaks ---
    'nuxt/nuxt-config-keys-order': 'off',
    'brace-style': 'off',
    'no-empty': 'off',
    'quote-props': 'off',
  },
  // Use 4 spaces specifically for Vue SFCs (template + script)
  overrides: [
    {
      files: ['**/*.vue'],
      rules: {
        '@stylistic/indent': 'off',
        'indent': 'off',
        'vue/html-indent': ['error', 4, { baseIndent: 0, alignAttributes: false }],
        'vue/script-indent': ['error', 4, { baseIndent: 0, switchCase: 1 }],
      },
    },
  ],
})
