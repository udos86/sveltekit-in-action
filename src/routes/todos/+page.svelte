<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<header class="flex justify-end p-3">
	<a href="/todos/add" class="as-button primary-button">Add Todo</a>
</header>

<ul class="bg-white divide-y divide-gray-200 border">
	{#each data.todos as todo (todo.id)}
		<li class="hover:bg-gray-200">
			<a href="/todos/{todo.id}" class:done-todo={todo.done} class="block p-3">{todo.text}</a>
		</li>
	{/each}
</ul>

<!--CountIncrementer /-->
