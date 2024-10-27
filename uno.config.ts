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
	}
});

