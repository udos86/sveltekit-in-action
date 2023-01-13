<script lang="ts">
	import type { Todo } from '@prisma/client';

	export let todo: Todo | undefined = undefined;

	const formModel = {
		text: todo?.text ?? '',
		done: todo?.done ?? false
	};
</script>

{#if todo}
	<input type="hidden" name="todoId" value={todo.id} />
{/if}

<label for="text">Text</label>
<input type="text" name="text" bind:value={formModel.text} />

<label for="done">Done:</label>
<input name="done" type="checkbox" bind:checked={formModel.done} value={formModel.done} />
