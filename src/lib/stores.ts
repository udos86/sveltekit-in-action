import { getContext, setContext } from 'svelte';
import { writable, type Updater, type Writable } from 'svelte/store';

// stores always become global in server environment
// therefore are never suitable for storing client-side state
// see https://github.com/sveltejs/kit/issues/4338
// see https://kit.svelte.dev/docs/state-management
// export const count = writable(0);

// provide store via Context API as described in official docs
// see https://kit.svelte.dev/docs/state-management#using-stores-with-context
export interface AppStores {
	count: Writable<number>;
}

// Unique key to identify context
export const appStores = Symbol();

// setContext cannot be called from root component context
export function initAppStores() {
	setContext<AppStores>(appStores, {
		count: writable(0)
	});
}

// single store wrapper following SvelteKit global stores
// see https://github.com/sveltejs/kit/blob/7b59a319dee38711fbf3b4a9b1f41622200904d0/packages/kit/src/runtime/app/stores.js
export const count = {
	subscribe(fn: (value: number) => void) {
		const { count } = getContext<AppStores>(appStores);
		if (count === undefined) throw new Error('Store could not be retrieved');
		return count.subscribe(fn);
	},
	set(value: number) {
		const { count } = getContext<AppStores>(appStores);
		return count.set(value);
	},
	update(fn: Updater<number>) {
		const { count } = getContext<AppStores>(appStores);
		return count.update(fn);
	}
};
