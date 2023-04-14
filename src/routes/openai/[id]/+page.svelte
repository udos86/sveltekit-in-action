<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { typewriter } from '$lib/anim';
	import { MessageAuthor } from '@prisma/client';
	import type { Message } from '@prisma/client';

	import type { ActionData, PageData } from './$types';

	type PartialMessage = Pick<Message, 'author' | 'id' | 'text'>;

	export let data: PageData;
	export let form: ActionData;

	let editTitle = false;
	let latestAiMessageId: string | null = null;
	let chat: PartialMessage[] = [...data.chat.messages];

	if (form !== null && form.action === 'ask') {
		const [input, output] = form.messages!;
		addMessage({
			text: input.text,
			author: MessageAuthor.USER,
			id: crypto.randomUUID()
		});
		addMessage({
			text: output.text,
			author: MessageAuthor.OPENAI,
			id: crypto.randomUUID()
		});
	}

	const onMessageSend: SubmitFunction = ({ controller, data }) => {
		const message = data.get('message');
		if (typeof message === 'string') {
			// when JS is available immediately display input message without waiting for form action
			addMessage({ text: message, author: MessageAuthor.USER, id: crypto.randomUUID() });
		} else {
			controller.abort();
		}
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data !== undefined) {
				const [, output] = result.data.messages;
				latestAiMessageId = output.id;
				addMessage(output);
			}
			update({ reset: false });
		};
	};

	function addMessage(message: PartialMessage) {
		chat = [...chat, message];
	}

	function onIntro(event: CustomEvent) {
		const { target, type } = event;
		if (target === null) throw new Error(`No animation target`);

		if (type === 'introstart') {
			(target as HTMLElement).classList.add('cursor-blink');
		} else if (type === 'introend') {
			(target as HTMLElement).classList.remove('cursor-blink');
		}
	}
</script>

<header class="flex">
	<form method="POST" action="?/title" class="self-center text-center grow">
		<input type="hidden" name="chatId" value={data.chat.id} />
		<label for="text" class="hidden">Chat Title</label>
		<input
			type="text"
			name="name"
			class="text-xl text-center p-0 font-bold w-full border-0 focus:ring-0 focus:ring-offset-0"
			value={data.chat.name}
		/>
		<input type="submit" hidden />
	</form>
</header>

<ul class="-mx-4 divide-y divide-gray-300">
	{#each chat as message (message.id)}
		<li class="flex items-start even:bg-gray-100 p-4">
			{#if message.author === MessageAuthor.USER && data?.session?.user?.image}
				<img
					width="24"
					height="24"
					src={data.session.user.image}
					alt="avatar"
					class="rounded-full border border-slate-500"
				/>
			{/if}
			{#if message.author === MessageAuthor.OPENAI}
				<img
					width="24"
					height="24"
					src="/logo_chatgpt.svg"
					alt="avatar"
					class="rounded-full border border-slate-500"
				/>
			{/if}
			{#if message.id === latestAiMessageId}
				<span class="grow max-w-lg ml-2" in:typewriter on:introstart={onIntro} on:introend={onIntro}>
					{message.text}
				</span>
			{:else}
				<span class="grow max-w-lg ml-2">{message.text}</span>
			{/if}
		</li>
	{/each}
</ul>

<footer class="fixed right-0 bottom-0 left-0 pb-24">
	<form method="POST" action="?/ask" use:enhance={onMessageSend} class="flex justify-center">
		<input type="hidden" name="chatId" value={data.chat.id} />
		<label for="text" class="hidden">Message</label>
		<input
			type="text"
			name="message"
			placeholder="Send a message"
			class="h-12 grow max-w-lg rounded shadow-lg"
			required
		/>
		<input type="submit" hidden />
	</form>
</footer>
