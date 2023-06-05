<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let id: string;
	export let state: 'auto' | 'manual' = 'auto';
	export let cancelable = true;

	const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog {id} popover={state}>
	<header class="py-2 border-b border-gray-300">
		<slot name="header" />
	</header>
	<div class="py-2 border-b border-gray-300">
		<slot />
	</div>
	<footer class="flex justify-end py-2 space-x-2">
		<slot name="confirmButton">
			<button
				type="button"
				class={cancelable ? 'danger-button' : 'primary-button'}
				popovertarget={id}
				popovertargetaction="hide"
				on:click={() => dispatch('confirm')}>Ok</button
			>
		</slot>
		<slot name="cancelButton">
			{#if cancelable}
				<button
					type="button"
					class="primary-button"
					popovertarget={id}
					popovertargetaction="hide"
					on:click={() => dispatch('cancel')}>Cancel</button
				>
			{/if}
		</slot>
	</footer>
</dialog>

<style>
	[popover] {
		max-width: 32em;
		border-radius: 0.25em;
		border: none;
		padding: 1em;
	}

	[popover]::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	[popover]:popover-open {
		animation: intro 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes intro {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	[popover]:popover-open::backdrop {
		animation: outro 0.2s ease-out;
	}

	@keyframes outro {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
