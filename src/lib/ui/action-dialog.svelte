<script lang="ts">
	import { enhance } from '$app/forms';
	import { createEventDispatcher } from 'svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let action: string;
	export let id: string;
	export let state: 'auto' | 'manual' = 'auto';
	export let useEnhance = true;
	export let onSubmit: SubmitFunction | null = null;

	let dialog: HTMLDialogElement;

	const submit: SubmitFunction = (input) => {
		// a button of type="submit" won't trigger popovertargetaction="hide" on the dialog
		// due to SvelteKit calling event.preventDefault() in handle_submit function in forms.js
		dialog.hidePopover();
		onSubmit?.(input);
	};

	const dispatch = createEventDispatcher();
</script>

<dialog {id} popover={state} bind:this={dialog}>
	<header class="py-2 border-b border-gray-300">
		<slot name="header" />
	</header>
	<div class="py-2 border-b border-gray-300">
		<slot />
	</div>
	<footer class="flex justify-end py-2 space-x-2">
		<form method="POST" {action} use:enhance={useEnhance ? submit : undefined}>
			<slot name="form" />
			<button
				class="danger-button"
				popovertarget={id}
				popovertargetaction="hide"
				on:click={() => dispatch('confirm')}><slot name="confirmButtonLabel">Confirm</slot></button
			>
		</form>
		<button
			type="button"
			class="primary-button"
			popovertarget={id}
			popovertargetaction="hide"
			on:click={() => dispatch('cancel')}><slot name="cancelButtonLabel">Cancel</slot></button
		>
	</footer>
</dialog>
