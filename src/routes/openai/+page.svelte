<script lang="ts">
	import { enhance } from '$app/forms';
	import { typewriter } from '$lib/anim';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let showCursor = false;
</script>

<header class="flex">
	<h2 class="grow">OpenAI</h2>
</header>

<form method="POST" action="?/ask" use:enhance>
	<label for="text">Your Question</label>
	<input type="text" name="prompt" />
	<button class="primary-button">Send</button>
</form>

{#if form}
	<p
		class={showCursor ? 'cursor-blink' : ''}
		transition:typewriter={{ delay: 2000 }}
		on:introstart={() => (showCursor = true)}
		on:introend={() => (showCursor = false)}
	>
		{form.data}
	</p>
{/if}

<style>
	@keyframes cursor-blink {
		from,
		to {
			background-color: transparent;
		}
		50% {
			background-color: black;
		}
	}

	.cursor-blink::after {
		content: '';
		width: 2px;
		height: 16px;
		background: black;
		margin: 0 0.125rem;
		display: inline-block;
		animation: cursor-blink 1s step-end infinite;
	}
</style>
