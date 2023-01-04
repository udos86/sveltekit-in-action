import type { Handle } from '@sveltejs/kit';
// import { count } from './stores';

export const handle = (async ({ event, resolve }) => {
    // reset global store per request to avoid state collision
    // count.set(0);

    return await resolve(event);

}) satisfies Handle;