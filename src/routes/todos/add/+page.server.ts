import type { Prisma } from '@prisma/client';
import { isAuthenticated } from '$lib/auth';
import type { PageServerLoad } from '../$types';
import type { Actions } from './$types';
import { parseFormData } from '$lib/validation';
import { addTodoFormData } from '$lib/validation/todos';

const url = '/api/todos';

export const load: PageServerLoad = async ({ locals }) => {
  await isAuthenticated(locals);
};

export const actions: Actions = {
  default: async ({ fetch, locals, request }) => {
    await isAuthenticated(locals);

    const formData = await parseFormData(request, addTodoFormData);
    const body: Prisma.TodoCreateWithoutUserInput = {
      text: formData.text,
      done: formData.done
    };

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json'
      }
    });

    return { success: true };
  }
};