import { isAuthenticated, isAuthorized } from "$lib/auth";
import { parseFormData } from "$lib/validation";
import { deleteChatFormData } from "$lib/validation/chat";
import { Permission, PrismaClient } from "@prisma/client";
import { error, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

const prisma = new PrismaClient();

export const load: PageServerLoad = (async ({ locals }) => {
	const session = await isAuthenticated(locals);
	await isAuthorized(session, Permission.OPENAI)

	const user = await prisma.user.findUnique({
		where: { email: session.user.email },
		include: { chats: { orderBy: { updatedAt: 'desc' } } }
	});

	if (user === null) {
		throw error(404, { message: `Unknown user` });
	}

	return { chats: user.chats };
});

export const actions: Actions = {
	new: async ({ locals }) => {
		const session = await isAuthenticated(locals);
		const chat = await prisma.chat.create({
			data: {
				name: 'New Chat',
				user: {
					connect: { email: session.user.email }
				}
			},
		});

		return { action: 'new' };
	},

	delete: async ({ locals, request }) => {
		const session = await isAuthenticated(locals);
		await isAuthorized(session, Permission.OPENAI);

		const { chatId } = await parseFormData(request, deleteChatFormData);
		await prisma.user.update({
			where: { email: session.user.email },
			data: {
				chats: {
					delete: { id: chatId },
				},
			},
			include: {
				chats: {}
			}
		});

		return { action: 'delete' };
	},
};