import { error } from '@sveltejs/kit';
import { isAuthenticated } from '$lib/auth';
import type { Prisma, Todo } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';

const url = '/api/todos';

export const load: PageServerLoad = (async ({ fetch, locals, params }) => {
  const session = await locals.getSession();
  isAuthenticated(session);

  const response = await fetch(`${url}/${params.id}`);
  const data: Todo | Error = await response.json();

  if (!response.ok) {
    const message = (data as Error).message;
    throw error(response.status, { message });
  }

  return { todo: data as Todo };
});

export const actions: Actions = {
  default: async ({ fetch, locals, request }) => {
    const session = await locals.getSession();
    isAuthenticated(session);

    const formData = await request.formData();
    const todoId = formData.get('id');
    const body: Prisma.TodoUpdateWithoutUserInput = {
      text: formData.get('text') as string,
      done: Boolean(formData.get('done') as string)
    };

    await fetch(`${url}/${todoId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    });

    return {isUpdated: true};
  }
};
