<script lang="ts">
	import { enhance } from '$app/forms';
	import Dialog from '$lib/ui/dialog.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Dialog id="deleteDialog" state="manual">
	<h2 slot="header">Delete Todo</h2>
	<p>Would really like to delete this todo?</p>
	<form slot="confirmButton" method="POST" action="?/delete" use:enhance>
		<input type="hidden" name="todoId" value={data.todo.id} />
		<button class="danger-button" popovertarget="deleteDialog" popovertargetaction="hide"
			>Delete</button
		>
	</form>
</Dialog>

<header class="flex space-x-3">
	<h2 class="grow">Todo Detail</h2>

	<a href="/todos/edit/{data.todo.id}" class="as-button primary-button">Edit Todo</a>

	<button type="button" class="danger-button" popovertarget="deleteDialog">Delete</button>
</header>

<p class:done-todo={data.todo.done}>{data.todo.text}</p>
