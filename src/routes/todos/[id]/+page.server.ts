import { error } from '@sveltejs/kit';
import type { Prisma, Todo } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';

const url = '/api/todos';

export const load = (async ({ fetch, params }) => {
  const response = await fetch(`${url}/${params.id}`);
  const data: Todo | Error = await response.json();

  if (!response.ok) {
    const message = (data as Error).message;
    throw error(response.status, { message });
  }

  return { todo: data as Todo };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ fetch, request }) => {
    const formData = await request.formData();
    const todoId = formData.get('id');
    const body: Prisma.TodoCreateInput = {
      text: formData.get('text') as string,
      done: Boolean(formData.get('done') as string)
    };

    const data = await fetch(`${url}/${todoId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    }).then(response => response.json());

    return { data };
  }
};
