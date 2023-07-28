<script lang="ts">
	import type { Todo } from '@prisma/client';

	// explicit set undefined to make prop optional without warnings
	// see https://github.com/sveltejs/svelte/issues/4893
	export let todo: Todo | undefined = undefined;

	export let value = {
		text: todo?.text ?? '',
		done: todo?.done ?? false
	};
</script>

{#if todo}
	<input type="hidden" name="todoId" value={todo.id} />
{/if}

<label for="text">Text</label>
<input type="text" name="text" bind:value={value.text} />

<label for="done">Done:</label>
<input name="done" type="checkbox" bind:checked={value.done} />
