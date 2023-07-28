<script lang="ts">
	import Dialog from '$lib/ui/dialog.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Dialog
	id="deleteTodoDialog"
	state="manual"
	formAction="?/delete"
	hiddenFieldName="todoId"
	hiddenFieldValue={data.todo.id}
>
	<h2 slot="header">Delete Todo</h2>
	<p>Would really like to delete this todo?</p>
</Dialog>

<header class="flex space-x-3">
	<h2 class="grow">Todo Detail</h2>

	<a href="/todos/edit/{data.todo.id}" class="as-button primary-button">Edit Todo</a>

	<button type="button" class="danger-button" popovertarget="deleteTodoDialog">Delete</button>
</header>

<p class:done-todo={data.todo.done}>{data.todo.text}</p>
