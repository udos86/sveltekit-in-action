import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

/** @type {import('vite').UserConfig} */
const config = {
	resolve: {
		alias: {
			// fixed Prisma bundling bug when importing enums
			// see https://github.com/prisma/prisma/issues/12504
			'.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js'
		}
	},
	define: {
		__BUILD_DATE__: `'${new Date().toISOString()}'`,
		__PERIODIC_UPDATE_SW__: false,
		'process.env.NODE_ENV': process.env.NODE_ENV === 'production' ? '"production"' : '"development"',
	},
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			srcDir: './src',
			mode: 'development',
			strategies: 'injectManifest',
			filename: 'sw.ts',
			scope: '/',
			base: '/',
			selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
			manifest: {
				short_name: 'SvelteKit Sample PWA',
				name: 'SvelteKit Sample PWA',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: "#ffffff",
				background_color: "#ffffff",
				icons: [],
			},
			injectManifest: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			devOptions: {
				enabled: false,
				type: 'module',
				navigateFallback: '/',
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
