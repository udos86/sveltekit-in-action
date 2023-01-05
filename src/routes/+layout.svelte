<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import '../app.css';
	import { appContextKey, type AppContext } from '../stores';
	import type { LayoutData } from './$types';

	const count = writable(0);

	setContext<AppContext>(appContextKey, { count });

	export let data: LayoutData;

	const onSignInButtonClicked = () => signIn('github');
	const onSignOutButtonClicked = () => signOut();
</script>

<header>
	<div>
		<p data-sveltekit-preload-data="off">
			{#if data.session}
				<span>
					{#if data.session.user?.image}
						<img width="32" height="32" src="{data.session.user.image}" alt="avatar" />
					{/if}
					<strong>{data.session.user?.email ?? data.session.user?.name}</strong>
				</span>
				<!--a href="/auth/signout">Sign out</a-->
				<button type="button" on:click={onSignOutButtonClicked} class="button">Sign out</button>
			{:else}
				<span>You are not signed in</span>
				<button type="button" on:click={onSignInButtonClicked}>Sign In with GitHub</button>
				<!--a href="/auth/signin">Sign in</a-->
			{/if}
		</p>
	</div>
	<nav>
		<a href="/">Home</a>
		<a href="/todos">Todos</a>
	</nav>
</header>

<main class="space-y-4">
	<slot />
</main>
