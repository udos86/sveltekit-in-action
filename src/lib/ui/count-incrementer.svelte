<script lang="ts">
	import { appStores, type AppStores } from '../stores';
	import { getContext } from 'svelte';

	const { count } = getContext<AppStores>(appStores);
</script>

<button class="bg-blue-500" on:click={() => count.update(value => value + 1)}>+1</button>
<p>{$count}</p>
