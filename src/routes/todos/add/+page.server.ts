import type { Prisma, Todo } from '@prisma/client';
import type { Actions } from './$types';

const url = '/api/todos';

export const actions: Actions = {
  default: async ({ fetch, request }) => {
    const formData = await request.formData();
    const body: Prisma.TodoCreateInput = {
      text: formData.get('text') as string,
      done: Boolean(formData.get('done') as string)
    };

    const data = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    }).then(response => response.json());

    return { data };
  }
};