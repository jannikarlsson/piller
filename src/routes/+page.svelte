<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { HOME_PATH } from '$lib/navigation';

	onMount(() => {
		goto(HOME_PATH);
	});
</script>
