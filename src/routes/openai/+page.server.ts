import { isAuthenticated, isAuthorized } from '$lib/auth';
import { prisma } from '$lib/prisma';
import { Permission } from '@prisma/client';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await isAuthenticated(locals);
	await isAuthorized(session, Permission.OPENAI);

	const user = await prisma.user.findUnique({
		where: { email: session.user.email },
		include: { chats: { orderBy: { updatedAt: 'desc' } } }
	});

	if (user === null) {
		error(404, { message: `Unknown user` });
	}

	return { chats: user.chats };
};

export const actions: Actions = {
	new: async ({ locals }) => {
		const session = await isAuthenticated(locals);
		await isAuthorized(session, Permission.OPENAI);

		const chat = await prisma.chat.create({
			data: {
				name: 'New Chat',
				user: {
					connect: { email: session.user.email }
				}
			}
		});

		redirect(302, `/openai/${chat.id}`);
	}
};
