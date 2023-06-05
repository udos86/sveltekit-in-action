<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;
	export let title: string;

	function isActive(pathname: string) {
		return href === '/' ? href === pathname : pathname.includes(href);
	}
</script>

<a {href} class="nav-link" class:active={isActive($page.url.pathname)}>{title}</a>
