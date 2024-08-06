import { createApp } from 'vue'
import './style.css'
import 'virtual:uno.css'
import VueLazyload from 'vue-lazyload'
import App from './App.vue'

createApp(App)
	.use(VueLazyload)
	.mount('#app')