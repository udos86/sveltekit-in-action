<script lang="ts">
	// import { SvelteComponent, onMount, type ComponentType } from 'svelte';
	import { fade } from 'svelte/transition';
	import { signIn, signOut } from '@auth/sveltekit/client';
	// import { pwaInfo } from 'virtual:pwa-info';
	import { beforeNavigate } from '$app/navigation';
	import { updated } from '$app/stores';
	import NavLink from '$lib/ui/nav-link.svelte';
	import type { LayoutData } from './$types';
	import '../app.css';

	export let data: LayoutData;

	// let PWAPrompt: ComponentType<SvelteComponent> | undefined;

	// $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	// reload app when a new version was deployed while using it
	// see https://kit.svelte.dev/docs/configuration#version
	// see https://github.com/sveltejs/kit/blob/f7c0246a1dee8050b8a5defee86eb7c90242c692/packages/kit/src/runtime/client/utils.js#L233
	beforeNavigate(({ willUnload, to }) => {
		if ($updated && !willUnload && to?.url instanceof URL) {
			location.href = to.url.href;
		}
	});
	/*
	onMount(async () => {
		if (pwaInfo !== undefined) {
			// Prompt needs to be importet dynamically on the client-side due to SSR/SSG
			PWAPrompt = (await import('$lib/pwa/Prompt.svelte')).default;
		}
	});
	*/
	const onSignInButtonClicked = () => signIn();
	const onSignOutButtonClicked = () => signOut();
</script>

<!--svelte:head>
	{@html webManifest}
</svelte:head-->

<header class="flex flex-col px-3 pt-2 border-b border-gray-300">
	<div class="flex justify-end items-center space-x-3 overflow-hidden">
		<h1 class="absolute w-full">SvelteKit Demo</h1>

		{#if data.session}
			{#if data.session.user?.image}
				<img
					width="48"
					height="48"
					src={data.session.user.image}
					alt="avatar"
					class="rounded-full border border-slate-500"
				/>
			{:else}
				<strong>{data.session.user?.name}</strong>
			{/if}
			<!--a href="/auth/signout">Sign out</a-->
			<button type="button" class="primary-button z-10" on:click={onSignOutButtonClicked}>Sign out</button>
		{:else}
			<button type="button" class="primary-button z-10" on:click={onSignInButtonClicked}>Sign In</button>
			<!--a href="/auth/signin">Sign in</a-->
		{/if}
	</div>

	<nav class="space-x-1">
		<NavLink href="/" title="Home" />
		<!--NavLink href="/todos" title="Todos" /-->
		<NavLink href="/openai" title="OpenAI" />
		<!--NavLink href="/upload" title="File Upload" /-->
	</nav>
</header>

<main class="flex-auto min-h-0">
	{#key data.pathname}
		<div class="flex flex-col min-h-0 h-full" in:fade={{ duration: 300, delay: 300 }} out:fade={{ duration: 300 }}>
			<slot />
		</div>
	{/key}
</main>
<!--
{#if PWAPrompt}
	<svelte:component this={PWAPrompt} />
{/if}
-->
