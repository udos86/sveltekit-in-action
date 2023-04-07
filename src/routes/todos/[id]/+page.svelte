<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<header class="flex space-x-3">
	<h2 class="grow">Todo Detail</h2>

	<a href="/todos/edit/{data.todo.id}" class="as-button primary-button">Edit Todo</a>

	<form method="POST" action="?/delete" use:enhance>
		<input type="hidden" name="todoId" value={data.todo.id} />
		<button class="danger-button">Delete</button>
	</form>
</header>

<p class:done-todo={data.todo.done}>{data.todo.text}</p>

<!--CountIncrementer /-->
