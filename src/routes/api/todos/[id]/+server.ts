import { error, json } from '@sveltejs/kit';
import { Prisma, PrismaClient } from '@prisma/client';
import { isAuthenticated } from '$lib/auth';
import { todoSelect } from '$lib/prisma';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ locals, params }) => {
  const session = await isAuthenticated(locals);

  const todo = await prisma.todo.findFirst({
    where: { id: params.id, user: { email: session.user.email } },
    select: todoSelect
  });

  if (todo === null) {
    throw error(404, { message: `Todo with id ${params.id} not found` });
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
    throw error(404, { message: `Todo with id ${params.id} not found` });
  }
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const session = await isAuthenticated(locals);

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        todos: {
          delete: { id: params.id },
        },
      },
    });
  } catch (err) {
    throw error(404, { message: `Todo with id ${params.id} not found` });
  }

  return new Response(null, { status: 204 });
};
