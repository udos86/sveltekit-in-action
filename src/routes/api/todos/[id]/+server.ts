import { error, json } from '@sveltejs/kit';
import { Prisma, PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';
import { isAuthenticated } from '$lib/auth';
import { todoSelect } from '$lib/prisma';

const prisma = new PrismaClient();

export const GET: RequestHandler = (async ({ locals, params }) => {
  const session = await locals.getSession();
  isAuthenticated(session);

  const todo = await prisma.todo.findUnique({
    where: { id: params.id },
    select: todoSelect
  });

  if (todo === null) {
    throw error(404, { message: `Todo with id ${params.id} not found` });
  }

  return json(todo);
});

export const PUT: RequestHandler = (async ({ locals, params, request }) => {
  const session = await locals.getSession();
  isAuthenticated(session);

  const data: Prisma.TodoUpdateInput = await request.json();

  try {
    const updatedTodo = await prisma.todo.update({
      where: { id: params.id },
      data,
      select: todoSelect
    });
    return json(updatedTodo);
  } catch (err) {
    throw error(404, { message: `Todo with id ${params.id} not found` });
  }
});
