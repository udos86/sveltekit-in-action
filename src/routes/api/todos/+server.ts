import { json } from '@sveltejs/kit';
import { Prisma, PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const GET: RequestHandler = (async () => {
  const todos = await prisma.todo.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  return json(todos);
});

export const POST: RequestHandler = (async ({ request }) => {
  const data: Prisma.TodoCreateInput = await request.json();
  const todo = await prisma.todo.create({data});

  return json(todo);
});