<script lang="ts">
	import { appContextKey, type AppContext } from '../stores';
	import { getContext } from 'svelte';

	const { count } = getContext<AppContext>(appContextKey);
</script>

<button on:click={() => ($count += 1)}>+1</button>
