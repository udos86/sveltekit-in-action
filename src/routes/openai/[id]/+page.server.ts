import { OpenAI } from "langchain/llms";
import { isAuthorized, isAuthenticated } from "$lib/auth";
import { MessageAuthor, Permission, PrismaClient } from "@prisma/client";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { parseFormData } from "$lib/validation";
import { chatDeleteFormData, chatEditNameFormData, chatMessageFormData } from "$lib/validation/chat";
import type { PageServerLoad } from "./$types";

const model = new OpenAI();
const prisma = new PrismaClient();

export const load: PageServerLoad = (async ({ locals, params }) => {
	const session = await isAuthenticated(locals);
	await isAuthorized(session, Permission.OPENAI)

	const chat = await prisma.chat.findFirst({
		where: { id: params.id, user: { email: session.user.email } },
		include: { messages: true }
	});

	if (chat === null) {
		throw error(404, { message: `Chat with id ${params.id} not found` });
	}

	return { chat };
});

export const actions: Actions = {
	title: async ({ locals, request }) => {
		const session = await isAuthenticated(locals);
		await isAuthorized(session, Permission.OPENAI);

		const { chatId, name } = await parseFormData(request, chatEditNameFormData);
		await prisma.user.update({
			where: { email: session.user.email },
			data: {
				chats: {
					update: {
						where: { id: chatId },
						data: { name }
					}
				}
			}
		});

		return { action: 'name' };
	},

	ask: async ({ locals, request }) => {
		const session = await isAuthenticated(locals);
		await isAuthorized(session, Permission.OPENAI);

		const { chatId, message } = await parseFormData(request, chatMessageFormData);
		const response = await model.call(message);

		const input = await prisma.message.create({
			data: {
				text: message,
				author: MessageAuthor.USER,
				chat: { connect: { id: chatId } },
				user: { connect: { email: session.user.email } }
			}
		});

		const output = await prisma.message.create({
			data: {
				text: response,
				author: MessageAuthor.OPENAI,
				chat: { connect: { id: chatId } },
				user: { connect: { email: session.user.email } }
			}
		});

		return { action: 'ask', messages: [input, output] };
	}
};