<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import '../app.css';
	import { appContextKey, type AppContext } from '../stores';
	import type { LayoutData } from './$types';

	const count = writable(0);

	setContext<AppContext>(appContextKey, { count });

	export let data: LayoutData;
</script>

<header>
	<div class="signedInStatus">
		<p class="nojs-show loaded" data-sveltekit-preload-data="off">
			{#if data.session}
				{#if data.session.user?.image}
					<span style="background-image: url('{data.session.user.image}')" class="avatar" />
				{/if}
				<span class="signedInText">
					<small>Signed in as</small><br />
					<strong>{data.session.user?.email ?? data.session.user?.name}</strong>
				</span>
				<a href="/auth/signout" class="button">Sign out</a>
			{:else}
				<span class="notSignedInText">You are not signed in</span>
				<a href="/auth/signin" class="buttonPrimary">Sign in</a>
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
