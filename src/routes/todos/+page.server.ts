import type { Todo } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { isAuthenticated } from '$lib/auth/guards';

const url = '/api/todos';

export const load: PageServerLoad = (async ({ fetch, locals }) => {
  const session = await locals.getSession();
  isAuthenticated(session);

  const response = await fetch(url);
  const todos = await response.json() as Todo[];

  return { todos };
});
