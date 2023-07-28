import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

export const prisma = new PrismaClient();

export const todoSelect: Prisma.TodoSelect = {
	id: true,
	done: true,
	text: true
};
