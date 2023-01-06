import type { Prisma } from '@prisma/client';
import { isAuthenticated } from '$lib/auth';
import type { PageServerLoad } from '../$types';
import type { Actions } from './$types';

const url = '/api/todos';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  isAuthenticated(session);
};

export const actions: Actions = {
  default: async ({ fetch, locals, request }) => {
    const session = await locals.getSession();
    isAuthenticated(session);

    const formData = await request.formData();
    const body: Prisma.TodoCreateWithoutUserInput = {
      text: formData.get('text') as string,
      done: Boolean(formData.get('done') as string)
    };

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json'
      }
    });

    return {isCreated: true};
  }
};