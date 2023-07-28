<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

	// replaced via Vite define plugin
	const periodicUpdateSW = __PERIODIC_UPDATE_SW__;

	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
		onRegisteredSW(_swScriptUrl, registration) {
			if (periodicUpdateSW) {
				registration && setInterval(() => registration.update(), 60 * 60 * 1000);
			} else {
				console.log(`SW registered: ${registration}`);
			}
		},
		onRegisterError(error) {
			console.log('SW registration error', error);
		}
	});

	const close = () => {
		offlineReady.set(false);
		needRefresh.set(false);
	};

	$: showPrompt = $offlineReady || $needRefresh;
</script>

{#if showPrompt}
	<div class="fixed right-0 bottom-0 border order-gray-300 p-3 m-4 rounded-md z-10" role="alert">
		<div class="mb-2">
			{#if $offlineReady}
				<span> App is ready to work offline</span>
			{:else}
				<span> New content available, click on reload button to update. </span>
			{/if}
		</div>
		{#if $needRefresh}
			<button type="button" class="primary-button" on:click={() => updateServiceWorker(true)}>Reload</button>
		{/if}
		<button type="button" class="primary-button" on:click={close}>Close</button>
	</div>
{/if}
