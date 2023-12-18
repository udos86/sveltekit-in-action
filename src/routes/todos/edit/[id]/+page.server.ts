import { isAuthenticated } from '$lib/auth';
import { error, fail } from '@sveltejs/kit';
import { parseFormData } from '$lib/validation';
import { editTodoFormData } from '$lib/validation/todos';
import { ZodError } from 'zod';
import type { Prisma, Todo } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';

const url = '/api/todos';

export const load: PageServerLoad = async ({ fetch, locals, params }) => {
	await isAuthenticated(locals);

	const response = await fetch(`${url}/${params.id}`);
	const data: Todo | Error = await response.json();

	if (!response.ok) {
		const message = (data as Error).message;
		error(response.status, { message });
	}

	return { todo: data as Todo };
};

export const actions: Actions = {
	edit: async ({ fetch, locals, request }) => {
		await isAuthenticated(locals);

		const formData = await parseFormData(request, editTodoFormData);
		if (formData instanceof ZodError) return fail(422, formData.formErrors);

		const body: Prisma.TodoUpdateWithoutUserInput = {
			text: formData.text,
			done: formData.done
		};

		await fetch(`${url}/${formData.todoId}`, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: { 'content-type': 'application/json' }
		});

		return { success: true };
	}
};
