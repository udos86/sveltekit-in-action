import { writable, type Writable } from 'svelte/store';

// becomes global in server environment
// therefore not suitable for client-side state management
// see https://github.com/sveltejs/kit/issues/4338
export const count = writable(0);

export interface AppContext {
    count: Writable<number>;
}

export const appContextKey = Symbol();
