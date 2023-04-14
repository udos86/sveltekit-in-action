<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data.chats);
</script>

<header class="flex">
	<h2 class="grow">OpenAI</h2>
	<form method="POST" action="?/new">
		<button class="primary-button">New Chat</button>
	</form>
</header>

<ul class="bg-white divide-y divide-gray-200 border rounded-t-md">
	{#each data.chats as chat (chat.id)}
		<li class="flex hover:bg-gray-200">
			<a href="/openai/{chat.id}" class="grow p-3">{chat.name}</a>
			<form method="POST" action="?/delete" class="self-center">
				<input type="hidden" name="chatId" value={chat.id} />
				<button class="text-black">❌</button>
			</form>
		</li>
	{/each}
</ul>
