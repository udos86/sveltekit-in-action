<script lang="ts">
	import { onMount } from 'svelte';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { pwaInfo } from 'virtual:pwa-info';
	import type { LayoutData } from './$types';
	import '../app.css';

	export let data: LayoutData;

	let PWAPrompt: ConstructorOfATypedSvelteComponent | undefined;

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	onMount(async () => {
		if (pwaInfo !== undefined) {
			// Prompt needs to be importet dynamically on the client-side due to SSR/SSG
			PWAPrompt = (await import('$lib/pwa/Prompt.svelte')).default;
		}
	});

	const onSignInButtonClicked = () => signIn();
	const onSignOutButtonClicked = () => signOut();
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>

<header class="flex flex-col px-3 pt-2 bg-gray-100 border-b border-gray-300">
	<div class="flex items-center space-x-3">
		<h1 class="grow">SvelteKit Demo</h1>

		{#if data.session}
			{#if data.session.user?.image}
				<img
					width="48"
					height="48"
					src={data.session.user.image}
					alt="avatar"
					class="rounded-full border border-slate-500"
				/>
			{/if}
			<strong>{data.session.user?.name}</strong>
			<!--a href="/auth/signout">Sign out</a-->
			<button type="button" class="primary-button" on:click={onSignOutButtonClicked}>Sign out</button>
		{:else}
			<button type="button" class="primary-button" on:click={onSignInButtonClicked}>Sign In</button>
			<!--a href="/auth/signin">Sign in</a-->
		{/if}
	</div>

	<nav class="space-x-1">
		<a href="/" class="nav-link">Home</a>
		<a href="/todos" class="nav-link">Todos</a>
		<a href="/openai" class="nav-link">OpenAI</a>
	</nav>
</header>

<main class="flex flex-col flex-auto min-h-0">
	<slot />
</main>

{#if PWAPrompt}
	<svelte:component this={PWAPrompt} />
{/if}
