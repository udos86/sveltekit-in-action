<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<header class="flex items-center p-3">
	<h2 class="grow">Chats</h2>
	<form method="POST" action="?/new">
		<button class="primary-button">New Chat</button>
	</form>
</header>

<ul class="bg-white divide-y divide-gray-200 border overflow-y-auto shadow-inner">
	{#each data.chats as chat (chat.id)}
		<li class="flex hover:bg-gray-200">
			<a href="/openai/{chat.id}" class="grow p-3">{chat.name}</a>
		</li>
	{/each}
</ul>
