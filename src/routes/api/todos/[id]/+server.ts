import { error, json } from '@sveltejs/kit';
import { isAuthenticated } from '$lib/auth';
import { prisma, todoSelect } from '$lib/prisma';
import type { Prisma } from '@prisma/client';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
	const session = await isAuthenticated(locals);

	const todo = await prisma.todo.findFirst({
		where: { id: params.id, user: { email: session.user.email } },
		select: todoSelect
	});

	if (todo === null) {
		error(404, { message: `Todo with id ${params.id} not found` });
	}

	return json(todo);
};

export const PUT: RequestHandler = async ({ locals, params, request }) => {
	const session = await isAuthenticated(locals);

	const data: Prisma.TodoUpdateInput = await request.json();

	try {
		await prisma.user.update({
			where: { email: session.user.email },
			data: {
				todos: {
					update: {
						where: { id: params.id },
						data
					}
				}
			}
		});
		return new Response();
	} catch (err) {
		error(404, { message: `Todo with id ${params.id} not found` });
	}
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const session = await isAuthenticated(locals);

	try {
		await prisma.user.update({
			where: { email: session.user.email },
			data: {
				todos: {
					delete: { id: params.id }
				}
			}
		});
	} catch (err) {
		error(404, { message: `Todo with id ${params.id} not found` });
	}

	return new Response(null, { status: 204 });
};
