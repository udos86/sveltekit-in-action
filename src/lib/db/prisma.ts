import type { Prisma } from "@prisma/client";

export const todoSelect: Prisma.TodoSelect = {
    id: true,
    done: true,
    text: true,
    createdAt: true,
    updatedAt: true
};
