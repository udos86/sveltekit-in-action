<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { appContextKey, type AppContext } from '../stores';
	import type { LayoutData } from './$types';
	import '../app.css';

	export let data: LayoutData;

	const count = writable(0);

	setContext<AppContext>(appContextKey, { count });

	const onSignInButtonClicked = () => signIn('github');
	const onSignOutButtonClicked = () => signOut();
</script>

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
	</nav>
</header>

<main class="p-3 space-y-4">
	<slot />
</main>
