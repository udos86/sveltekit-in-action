import { error, json } from '@sveltejs/kit';
import { Prisma, PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const GET: RequestHandler = (async ({ params }) => {
  const todo = await prisma.todo.findUnique({
    where: { id: params.id }
  });

  if (todo === null) {
    throw error(404, { message: `Todo with id ${params.id} not found` });
  }

  return json(todo);
});

export const PUT: RequestHandler = (async ({ params, request }) => {
  const data: Prisma.TodoUpdateInput = await request.json();

  try {
    const updatedTodo = await prisma.todo.update({
      where: { id: params.id },
      data
    });
    return json(updatedTodo);
  } catch (err) {
    throw error(404, { message: `Todo with id ${params.id} not found` });
  }
});
