<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let fileInput: HTMLInputElement;
</script>

<form method="POST" action="?/upload" enctype="multipart/form-data" use:enhance>
	<input type="file" name="file" class:hidden={browser} bind:this={fileInput} />
	<button type="button" class="primary-button" class:hidden={!browser} on:click={() => fileInput.click()}
		>Pick File</button
	>
	<button class="primary-button">Send</button>
</form>

{#if form?.result}
	<p class="p-4">{form.result}</p>
{/if}
