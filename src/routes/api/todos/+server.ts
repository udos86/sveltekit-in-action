import { json } from '@sveltejs/kit';
import { Prisma, PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';
import { isAuthenticated } from '$lib/auth';
import { todoSelect } from '$lib/prisma';

const prisma = new PrismaClient();

export const GET: RequestHandler = (async ({ locals, request }) => {
  const session = await locals.getSession();
  isAuthenticated(session);

  const userId = request.headers.get('x-user-id') as string;
  /*
  const todos = await prisma.todo.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: todoSelect
  });
  */
  const result = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      todos: {
        orderBy: { updatedAt: 'desc' },
        select: todoSelect
      }
    }
  });
  
  return json(result?.todos);
});

export const POST: RequestHandler = (async ({ locals, request }) => {
  const session = await locals.getSession();
  isAuthenticated(session);

  const userId = request.headers.get('x-user-id') as string;
  const data: Prisma.TodoCreateWithoutUserInput = await request.json();

  const todo = await prisma.todo.create({
    data: {
      ...data,
      user: {
        connect: { id: userId }
      }
    },
    select: todoSelect
  });

  return json(todo);
});