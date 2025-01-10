import { defineConfig } from 'unocss';
import { CustomTheme } from './styles/Theme';

export default defineConfig({
	rules: [
		[/^bg-color-([a-z\d]+)$/, ([_, value]) => ({ 'background-color': `#${value}` })],
		[/^color-([a-z\d]+)$/, ([_, value]) => ({ color: `#${value}` })],
		[/^fs-(\d+px)$/, ([_, value]) => ({ 'font-size': value })],
		[/^wp-([0-9]+)$/, ([_, value]) => ({ 'width': `${value}%` })],
		[/^hp-([0-9]+)$/, ([_, value]) => ({ 'height': `${value}%` })],
		[/^main-content-([a-z]+)$/, CustomTheme],
		[/^main$/, ([_]) => ({ 'height': `calc(100vh - 60px)` })],
	],
	shortcuts: {
		'flex-middle': 'flex items-center justify-center',
		'h-s-screen': 'h-100svh',
		'w-s-screen': 'w-100svw',
		'wh-full': 'h-full w-full',
		'wh-s-screen': 'h-s-screen w-s-screen',
		'header-content': 'self-center b-unset! mr-2 cursor-pointer hover:color-7194e5'
	},
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
});

