<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import TodoForm from '../todo-form.svelte';
	import CountIncrementer from '../../../count-incrementer.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let editable = false;

	const onButtonClicked = () => (editable = !editable);

	const onSubmit: SubmitFunction = ({}) => {
		return async ({ update }) => {
			update({ reset: false });
		};
	};
</script>

<h1>Todo Detail</h1>

<button on:click={onButtonClicked}>Toggle Edit</button>

{#if editable}
	<form method="POST" use:enhance={onSubmit}>
		<TodoForm todo={data.todo} />
	</form>
	<p>{JSON.stringify(form)}</p>
{:else}
	<p>{data.todo.text}</p>
{/if}

<CountIncrementer />
