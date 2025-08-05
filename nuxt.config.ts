// import removeConsole from 'vite-plugin-remove-console'; // 先註解掉

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            link: [{ rel: 'icon', type: 'image/svg+xml', href: '/mygo.svg' }],
            noscript: [{ children: 'Javascript is required.' }],
            title: ''
        },
        keepalive: true
    },

    devServer: {
        host: process.env.DEV_SERVER_HOST,
        port: Number(process.env.DEV_SERVER_PORT) || undefined
    },

    devtools: { enabled: false },

    experimental: {
        headNext: true,
        // inlineSSRStyles: true
    },

    imports: {
        dirs: ['./composables/**/*.ts']
    },

    modules: [
        '@unocss/nuxt',
        '@vueuse/nuxt',
        'nuxt-purgecss',
        '@element-plus/nuxt'
    ],

    nitro: { 
        compressPublicAssets: true,
        experimental: {
            wasm: true
        }
    },

    purgecss: {
        enabled: false,
        safelist: {
            deep: [],
            standard: [
                /-(appear|enter|leave)(|-(active|from|to))$/,
                /--unocss--/,
                /-\[\S+\]/,
                /.*data-v-.*/,
                /:deep/,
                /:global/,
                /:slotted/,
                /^(?!cursor-move).+-move$/,
                /^nuxt-link(|-exact)-active$/,
                /__uno_hash_(\w{6})/,
                '__nuxt',
                'body',
                'html',
                'nuxt-progress'
            ]
        }
    },

    plugins: [
        '~/plugins/vue-lazyload.ts'
    ],

    ssr: true,

    typescript: {
        tsConfig: {
            compilerOptions: {
                noImplicitOverride: true,
                noUncheckedIndexedAccess: true,
                noUnusedLocals: true,
                noUnusedParameters: true,
                "types": ["element-plus/global"]
            }
        },
        typeCheck: true
    },

    vite: {
        // plugins: process.env.NODE_ENV === 'production' ? [] : [removeConsole()]
    },

    elementPlus: {
        themes: ['dark'],
    },

    runtimeConfig: {
        // 私有配置 (僅服務器端可用)
        mongodbConnectUrl: process.env.MONGODB_CONNECT_URL,
        mongodbCollection: process.env.MONGODB_COLLECTION,
        
        // 公共配置 (客戶端和服務器端都可用)
        NUXT_IMG_BASE_URL: process.env.NUXT_IMG_BASE_URL,
        
        public: {
            apiBase: process.env.API_BASE_URL || '/api/v1',
        }
    },
    
    compatibilityDate: '2024-10-27',
    
    css: [
        '~/styles/default.css'
    ]
});