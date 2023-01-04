<script lang="ts">
	import '../app.css';
	// import { count } from '../stores';
	import { appContextKey, type AppContext } from '../stores';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	const count = writable(0);

	setContext<AppContext>(appContextKey, { count });
</script>

<header>
	<h1 class="text-3xl font-bold">SvelteKit Demo {$count}</h1>

	<nav>
		<a href="/">Home</a>
		<a href="/todos">Todos</a>
	</nav>
</header>

<main class="space-y-4">
	<slot />
</main>
