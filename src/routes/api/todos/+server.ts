import { json } from '@sveltejs/kit';
import { Prisma, PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const GET = (async () => {
  const todos = await prisma.todo.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  return json(todos);

}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
  const data: Prisma.TodoCreateInput = await request.json();
  const todo = await prisma.todo.create({data});

  return json(todo);

}) satisfies RequestHandler;