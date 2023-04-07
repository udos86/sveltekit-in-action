<script lang="ts">
	import { page } from '$app/stores';

	let { error, status } = $page;
</script>

<h2>Error {status}</h2>

<p class="text-center">{error?.message}</p>
