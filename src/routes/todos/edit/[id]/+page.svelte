<script lang="ts">
	import { enhance } from '$app/forms';
	import TodoForm from '$lib/ui/todo-form.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const onSubmit: SubmitFunction = ({}) => {
		return async ({ update }) => {
			update({ reset: false });
		};
	};
</script>

<header class="flex">
	<h2 class="grow">Update Todo</h2>
</header>

<form method="POST" action="?/edit" use:enhance={onSubmit}>
	<TodoForm todo={data.todo} />
	<button class="primary-button">Save</button>
</form>

{#if form}
	<p>{JSON.stringify(form)}</p>
{/if}
