<script lang="ts">
	import TodoForm from '$lib/ui/todo-form.svelte';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
</script>

<h2>Add Todo</h2>
<form method="POST" use:enhance>
	<TodoForm />
	<button class="primary-button">Save</button>
</form>

{#if form}
	<p>{JSON.stringify(form)}</p>
{/if}

<!--CountIncrementer /-->
