<script lang="ts">
	import CountIncrementer from '../../count-incrementer.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h2>Todos</h2>

<a href="/todos/add">Add Todo</a>

<ul>
	{#each data.todos as todo (todo.id)}
		<li><a href="/todos/{todo.id}" class:strike-through={todo.done}>{todo.text}</a></li>
	{/each}
</ul>

<CountIncrementer />
