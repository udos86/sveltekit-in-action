import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// referencing a property of url makes load function re-run on any of its change
	const { pathname } = url;
	const session = await locals.auth();

	return { pathname, session };
};
