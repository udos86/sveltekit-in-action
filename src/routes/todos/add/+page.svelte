<script lang="ts">
	import TodoForm from '../todo-form.svelte';
	import CountIncrementer from '../../../count-incrementer.svelte';
	// import type { ActionData } from './$types';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	// export let form: ActionData;
</script>

<h1>Add Todo</h1>
<form method="POST" use:enhance>
	<TodoForm />
</form>

<p>{JSON.stringify($page.form)}</p>

<CountIncrementer />
