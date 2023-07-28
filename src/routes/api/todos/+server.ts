import { error, json } from '@sveltejs/kit';
import { isAuthenticated } from '$lib/auth';
import { prisma, todoSelect } from '$lib/prisma';
import type { RequestHandler } from './$types';
import type { Prisma } from '@prisma/client';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await isAuthenticated(locals);

	const user = await prisma.user.findUnique({
		where: { email: session.user.email },
		include: {
			todos: {
				orderBy: { updatedAt: 'desc' },
				select: todoSelect
			}
		}
	});

	if (user === null) {
		throw error(404, { message: `Unknown user` });
	}

	return json(user.todos);
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await isAuthenticated(locals);

	const data: Prisma.TodoCreateWithoutUserInput = await request.json();

	const todo = await prisma.todo.create({
		data: {
			...data,
			user: {
				connect: { email: session.user.email }
			}
		},
		select: todoSelect
	});

	return json(todo);
};
