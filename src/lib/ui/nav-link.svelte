<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
	export let title: string;

	$: pathname = $page.url.pathname;
	$: isActive = href === '/' ? href === pathname : pathname.includes(href);
</script>

<a {href} class="nav-link" class:active={isActive}>{title}</a>
