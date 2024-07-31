/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/info" />

import { DefaultSession } from '@auth/core/types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare global {
	const __BUILD_DATE__: string;
	const __PERIODIC_UPDATE_SW__: boolean;
	const AUTHJS_VERSION: string;
	const SVELTE_VERSION: string;
	const SVELTEKIT_VERSION: string;
}

// see https://github.com/nextauthjs/next-auth/issues/847
declare module '@auth/core/types' {
	interface Session {
		user?: {
			id?: string;
			permissions?: string[];
		} & DefaultSession['user'];
	}

	interface User {
		permissions?: string[];
	}
}

export { };
