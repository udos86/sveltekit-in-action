<script lang="ts">
	import { afterUpdate, onMount, tick } from 'svelte';
	import { MessageAuthor } from '@prisma/client';
	import { enhance } from '$app/forms';
	import { typewriter } from '$lib/anim';
	import Dialog from '$lib/ui/dialog.svelte';
	import Icon from '$lib/ui/icon.svelte';
	import type { Message } from '@prisma/client';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData } from './$types';

	type PartialMessage = Pick<Message, 'author' | 'id' | 'text'>;

	export let data: PageData;

	let chat: PartialMessage[] = [...data.chat.messages];
	let chatElement: HTMLUListElement;
	let formPending = false;
	let pendingAiMessageId: string | null = null;
	let chatScrollObserver: IntersectionObserver;

	onMount(() => {
		scrollToEnd();
		chatScrollObserver = new IntersectionObserver(onIntersectionEvent, { root: chatElement });
	});

	afterUpdate(() => updateObserver());

	const onMessageSend: SubmitFunction = async ({ controller, formData, formElement }) => {
		const message = formData.get('message');

		if (typeof message !== 'string') {
			controller.abort();
			return;
		}

		formPending = true;
		formElement.reset();

		pendingAiMessageId = crypto.randomUUID();

		// when JS is available add input and pending output message with random ids
		// to immediately display content without waiting for form action result
		const humanMessage = { text: message, author: MessageAuthor.HUMAN, id: crypto.randomUUID() };
		const pendingAiMessage = { text: '', author: MessageAuthor.AI, id: pendingAiMessageId };

		updateChat(humanMessage, pendingAiMessage);

		// wait until message has entered the DOM then scroll
		await tick();
		scrollToEnd();

		return async ({ result }) => {
			formPending = false;

			if (result.type === 'success' && result.data !== undefined) {
				const [, output] = result.data.messages;
				pendingAiMessage.text = output.text;
				updateChat();
			}
		};
	};

	const onIntersectionEvent: IntersectionObserverCallback = async ([entry]) => {
		if (entry.isIntersecting) {
			// console.log('target is intersecting');
		}
	};

	function updateChat(...messages: PartialMessage[]) {
		chat = [...chat, ...messages];
	}

	function updateObserver() {
		chatScrollObserver.disconnect();
		const target = chatElement.querySelector('li:nth-of-type(5)');
		if (target instanceof HTMLLIElement) chatScrollObserver.observe(target!);
	}

	function scrollToEnd() {
		if (chatElement) chatElement.scroll({ behavior: 'auto', top: chatElement.scrollHeight });
	}

	function onIntroEnd(event: CustomEvent) {
		const { target } = event;
		if (target === null) throw new Error(`No animation target`);

		if (!formPending) {
			(target as HTMLElement).classList.remove('cursor-blink');
			pendingAiMessageId = null;
		}
	}
</script>

<Dialog
	id="deleteChatDialog"
	state="manual"
	formAction="?/delete"
	hiddenFieldName="chatId"
	hiddenFieldValue={data.chat.id}
>
	<h2 slot="header">Delete Chat</h2>
	<p>Would you really like to delete this chat?</p>
</Dialog>

<header class="flex p-3 border-b border-gray-300">
	<form method="POST" action="?/title" class="self-center text-center grow" use:enhance>
		<input type="hidden" name="chatId" value={data.chat.id} />
		<label for="chatName" class="hidden">Chat Title</label>
		<input
			type="text"
			name="name"
			id="chatName"
			class="text-xl text-center p-0 font-bold w-full border-0 focus:ring-0 focus:ring-offset-0"
			value={data.chat.name}
		/>
		<input type="submit" hidden />
	</form>

	<button
		type="button"
		class="icon-button"
		popovertarget="deleteChatDialog"
		popovertargetaction="show"
	>
		<Icon name="trash" />
	</button>
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
			{#if message.id === pendingAiMessageId}
				{#key message.text}
					<span
						class="grow max-w-lg ml-2 cursor-blink"
						in:typewriter={{ scrollContainer: chatElement, text: message.text }}
						on:introend={onIntroEnd}
					/>
				{/key}
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
		<label for="chatMessage" class="hidden">Message</label>
		<input
			type="text"
			name="message"
			id="chatMessage"
			placeholder="Send a message"
			class="h-12 grow max-w-lg border-2 focus:border-sky-600 rounded"
			required
		/>
		<input type="submit" hidden />
	</form>
</footer>
