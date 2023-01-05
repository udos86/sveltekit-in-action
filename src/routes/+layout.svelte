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

<header>

	<h1>SvelteKit Demo {$count}</h1>

	{#if data.session}
		<span>
			{#if data.session.user?.image}
				<img width="32" height="32" src={data.session.user.image} alt="avatar" />
			{/if}
			<strong>{data.session.user?.email ?? data.session.user?.name}</strong>
		</span>
		<!--a href="/auth/signout">Sign out</a-->
		<button type="button" on:click={onSignOutButtonClicked}>Sign out</button>
	{:else}
		<span>You are not signed in</span>
		<button type="button" on:click={onSignInButtonClicked}>Sign In with GitHub</button>
		<!--a href="/auth/signin">Sign in</a-->
	{/if}

	<nav>
		<a href="/">Home</a>
		<a href="/todos">Todos</a>
	</nav>

</header>

<main class="space-y-4">
	<slot />
</main>
