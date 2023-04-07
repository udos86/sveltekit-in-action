// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/info" />

declare const __BUILD_DATE__: string
declare const __PERIODIC_UPDATE_SW__: boolean

declare namespace App {
	// interface Error {}
	interface Locals {
		userId: string | undefined;
	}
	// interface PageData {}
	// interface Platform {}
}
