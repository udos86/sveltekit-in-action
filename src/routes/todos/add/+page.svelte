<script lang="ts">
	import TodoForm from '$lib/ui/todo-form.svelte';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import type { Snapshot } from '@sveltejs/kit';
	import type { Todo } from '@prisma/client';

	export let form: ActionData | undefined;

	let formValue: Pick<Todo, 'text' | 'done'> | undefined;

	export const snapshot: Snapshot = {
		capture: () => formValue,
		restore: (value) => (formValue = value)
	};
</script>

<h2>Add Todo</h2>
<form method="POST" use:enhance>
	<TodoForm bind:value={formValue} />
	<button class="primary-button">Save</button>
</form>

{#if form}
	<p>{JSON.stringify(form)}</p>
{/if}

<!--CountIncrementer /-->
