import removeConsole from 'vite-plugin-remove-console';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: {
			link: [{ rel: 'icon', href: '/favicon.ico' }],
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

	nitro: { compressPublicAssets: true },

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
		plugins: [removeConsole()]
	},

	elementPlus: {
		themes: ['dark'],
	},

	runtimeConfig: {
		public: {
			API_BASE_URL: process.env.API_BASE_URL || 'default_value',
		}
	},
	compatibilityDate: '2024-10-27',
	css: [
		'~/styles/default.css'
	]
});
