import type { Prisma } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { ZodError } from 'zod';
import { isAuthenticated } from '$lib/auth';
import { parseFormData } from '$lib/validation';
import { addTodoFormData } from '$lib/validation/todos';
import type { PageServerLoad } from '../$types';
import type { Actions } from './$types';

const url = '/api/todos';

export const load: PageServerLoad = async ({ locals }) => {
	await isAuthenticated(locals);
};

export const actions: Actions = {
	add: async ({ fetch, locals, request }) => {
		await isAuthenticated(locals);

		const formData = await parseFormData(request, addTodoFormData);
		if (formData instanceof ZodError) return fail(422, formData.formErrors);

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
