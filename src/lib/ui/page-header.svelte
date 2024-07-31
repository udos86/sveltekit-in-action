<script lang="ts">
	export let title: string | null = null;
	export let _class = '';
</script>

<header class="grid grid-cols-[1fr_auto_1fr] items-center p-3 border-b border-gray-300 {_class}">
	{#if $$slots.start}
		<div class="flex gap-3">
			<slot name="start" />
		</div>
	{/if}

	{#if typeof title === 'string'}
		<h2 class="col-start-2">{title}</h2>
	{/if}

	{#if $$slots.title}
		<div class="col-start-2">
			<slot name="title" />
		</div>
	{/if}

	{#if $$slots.end}
		<div class="col-start-3 flex justify-end gap-3">
			<slot name="end" />
		</div>
	{/if}
</header>
