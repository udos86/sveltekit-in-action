// import type { Todo } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { isAuthenticated } from '$lib/auth';

const url = '/api/todos';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	await isAuthenticated(locals);

	const response = await fetch(url);
	const todos = await response.json();

	return { todos };
};
