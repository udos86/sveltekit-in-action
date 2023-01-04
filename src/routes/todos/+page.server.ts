import type { Todo } from '@prisma/client';
import type { PageServerLoad } from './$types';

const url = '/api/todos';

export const load = (async ({ fetch }) => {
  const response = await fetch(url);
  const todos = await response.json() as Todo[];

  return { todos };
}) satisfies PageServerLoad;