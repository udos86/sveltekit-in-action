import { json } from '@sveltejs/kit';
import { Prisma, PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';
import { isAuthenticated } from '$lib/auth/guards';
import { todoSelect } from '$lib/db/prisma';

const prisma = new PrismaClient();

export const GET: RequestHandler = (async ({ locals }) => {
  const session = await locals.getSession();
  isAuthenticated(session);

  const result = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
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

  const data: Prisma.TodoCreateWithoutUserInput = await request.json();

  const todo = await prisma.todo.create({
    data: {
      ...data,
      user: {
        connect: { email: session!.user!.email! }
      }
    },
    select: todoSelect
  });

  return json(todo);
});