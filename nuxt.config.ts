// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@unocss/nuxt',
  ],

  devtools: { enabled: true },

  app: {
    head: {
      link: [
        // Favicon
        { rel: 'icon', type: 'image/svg+xml', href: '/mygo.svg' },
      ],
      noscript: [{ innerHTML: 'Javascript is required.' }],
      title: 'Caryolite - Official',
    },
    keepalive: true,
    baseURL: process.env.BASE_URL || '/',
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
    disableTransition: false,
  },

  runtimeConfig: { // 私有配置 (僅服務器端可用)
    mongodbConnectUrl: process.env.MONGODB_CONNECT_URL,
    mongodbCollection: process.env.MONGODB_COLLECTION,

    // 公共配置 (客戶端和服務器端都可用)
    NUXT_IMG_BASE_URL: process.env.NUXT_IMG_BASE_URL,

    public: {
      apiBase: process.env.API_BASE_URL || '/api/v1',
    },
  },

  devServer: {
    host: process.env.DEV_SERVER_HOST,
    port: Number(process.env.DEV_SERVER_PORT) || undefined,
  },

  compatibilityDate: '2025-08-27',
})
