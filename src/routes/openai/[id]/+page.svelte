<script lang="ts">
	import { enhance } from '$app/forms';
	import { typewriter } from '$lib/anim';
	import { MessageAuthor } from '@prisma/client';
	import type { Message } from '@prisma/client';
	import type { SubmitFunction } from '@sveltejs/kit';

	import type { ActionData, PageData } from './$types';
	import { onMount, tick } from 'svelte';

	type PartialMessage = Pick<Message, 'author' | 'id' | 'text'>;

	export let data: PageData;
	export let form: ActionData;

	let latestAiMessageId: string | null = null;
	let chat: PartialMessage[] = [...data.chat.messages];
	let chatElement: HTMLUListElement;

	if (form !== null && form.action === 'ask') {
		const [input, output] = form.messages!;
		addMessage({
			text: input.text,
			author: MessageAuthor.HUMAN,
			id: crypto.randomUUID()
		});
		addMessage({
			text: output.text,
			author: MessageAuthor.AI,
			id: crypto.randomUUID()
		});
	}

	onMount(() => scrollToEnd());

	const onMessageSend: SubmitFunction = async ({ controller, formData, formElement }) => {
		const message = formData.get('message');
		formElement.reset();
		if (typeof message === 'string') {
			// when JS is available immediately display input message without waiting for form action
			addMessage({ text: message, author: MessageAuthor.HUMAN, id: crypto.randomUUID() });
			// wait until message has entered the DOM then scroll
			await tick();
			scrollToEnd();
		} else {
			controller.abort();
		}

		return async ({ result }) => {
			if (result.type === 'success' && result.data !== undefined) {
				const [, output] = result.data.messages;
				latestAiMessageId = output.id;
				addMessage(output);
			}
		};
	};

	function addMessage(message: PartialMessage) {
		chat = [...chat, message];
	}

	function scrollToEnd() {
		chatElement.scroll({ behavior: 'auto', top: chatElement.scrollHeight });
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

<header class="flex p-4 pb-3 border-b border-gray-300">
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

<ul class="grow divide-y divide-gray-300 overflow-y-auto shadow-inner" bind:this={chatElement}>
	{#each chat as message (message.id)}
		<li class="flex items-start even:bg-gray-100 p-4">
			{#if message.author === MessageAuthor.HUMAN && data?.session?.user?.image}
				<img
					width="24"
					height="24"
					src={data.session.user.image}
					alt="avatar"
					class="rounded-full border border-slate-500"
				/>
			{/if}
			{#if message.author === MessageAuthor.AI}
				<img
					width="24"
					height="24"
					src="/logo_chatgpt.svg"
					alt="avatar"
					class="rounded-full border border-slate-500"
				/>
			{/if}
			{#if message.id === latestAiMessageId}
				<span
					class="grow max-w-lg ml-2"
					in:typewriter={{ scrollContainer: chatElement }}
					on:introstart={onIntro}
					on:introend={onIntro}
				>
					{message.text}
				</span>
			{:else}
				<span class="grow max-w-lg ml-2">{message.text}</span>
			{/if}
		</li>
	{/each}
</ul>

<footer class="pb-7 pt-5 flex-inital border-t border-gray-300 shadow-lg">
	<form method="POST" action="?/ask" use:enhance={onMessageSend} class="flex justify-center">
		<input type="hidden" name="chatId" value={data.chat.id} />
		<!--input
			type="hidden"
			name="lastHumanMessage"
			value={data.chat.messages.findLast((message) => message.author === MessageAuthor.HUMAN)}
		/>
		<input
			type="hidden"
			name="lastAiMessage"
			value={data.chat.messages.findLast((message) => message.author === MessageAuthor.AI)}
		/-->
		<label for="text" class="hidden">Message</label>
		<input
			type="text"
			name="message"
			placeholder="Send a message"
			class="h-12 grow max-w-lg border-2 focus:border-sky-600 rounded"
			required
		/>
		<input type="submit" hidden />
	</form>
</footer>
