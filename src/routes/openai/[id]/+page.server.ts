import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage } from 'langchain/schema';
import { isAuthorized, isAuthenticated } from '$lib/auth';
import { MessageAuthor, Permission } from '@prisma/client';
import { prisma } from '$lib/prisma';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { parseFormData } from '$lib/validation';
import { ZodError } from 'zod';
import { editChatNameFormData, addChatMessageFormData, deleteChatFormData } from '$lib/validation/chat';
import type { PageServerLoad } from './$types';

const chat = new ChatOpenAI();

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await isAuthenticated(locals);
	isAuthorized(session, Permission.OPENAI);

	const chat = await prisma.chat.findFirst({
		where: { id: params.id, user: { email: session.user.email } },
		include: { messages: true }
	});

	if (chat === null) {
		throw error(404, { message: `Chat with id ${params.id} not found` });
	}

	return { chat };
};

export const actions: Actions = {
	title: async ({ locals, request }) => {
		const session = await isAuthenticated(locals);
		isAuthorized(session, Permission.OPENAI);

		const formData = await parseFormData(request, editChatNameFormData);
		if (formData instanceof ZodError) return fail(422, formData.formErrors);

		const { email } = session.user;
		const { chatId, name } = formData;

		await prisma.user.update({
			where: { email },
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
		isAuthorized(session, Permission.OPENAI);

		const formData = await parseFormData(request, addChatMessageFormData);
		if (formData instanceof ZodError) return fail(422, formData.formErrors);

		const { chatId, message } = formData;

		const response = await chat.call([new HumanMessage(message)]);

		const input = await prisma.message.create({
			data: {
				text: message,
				author: MessageAuthor.HUMAN,
				chat: { connect: { id: chatId } },
				user: { connect: { email: session.user.email } }
			}
		});

		const output = await prisma.message.create({
			data: {
				text: response.content,
				author: MessageAuthor.AI,
				chat: { connect: { id: chatId } },
				user: { connect: { email: session.user.email } }
			}
		});

		/*
		const input = { author: MessageAuthor.HUMAN, text: message };
		const output = { author: MessageAuthor.AI, text: 'Dies ist ein Beispieltext' };
		*/
		return { action: 'ask', messages: [input, output] };
	},

	delete: async ({ locals, request }) => {
		const session = await isAuthenticated(locals);
		isAuthorized(session, Permission.OPENAI);

		const formData = await parseFormData(request, deleteChatFormData);
		if (formData instanceof ZodError) return fail(422, formData.formErrors);

		const { email } = session.user;
		const { chatId } = formData;

		await prisma.user.update({
			where: { email },
			data: {
				chats: {
					delete: { id: chatId }
				}
			},
			include: {
				chats: {}
			}
		});

		throw redirect(302, `/openai`);
	}
};
