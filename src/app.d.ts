/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/info" />

declare const __BUILD_DATE__: string;
declare const __PERIODIC_UPDATE_SW__: boolean;

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
