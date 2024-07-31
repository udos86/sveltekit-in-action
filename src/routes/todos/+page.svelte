<script lang="ts">
	import PageHeader from '$lib/ui/page-header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<PageHeader title="My Todos">
	<svelte:fragment slot="end">
		<a href="/todos/add" class="as-button primary-button">Add Todo</a>
	</svelte:fragment>
</PageHeader>

<ul class="bg-white divide-y divide-gray-200 border rounded-t-md">
	{#each data.todos as todo (todo.id)}
		<li class="hover:bg-gray-200">
			<a href="/todos/{todo.id}" class:done-todo={todo.done} class="block p-3">{todo.text}</a>
		</li>
	{/each}
</ul>
