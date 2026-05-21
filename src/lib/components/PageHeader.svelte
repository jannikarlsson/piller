<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
	}
	let { title, subtitle }: Props = $props();
</script>

<header class="page-header">
	<h1 class="page-header__title">{title}</h1>
	{#if subtitle}
		<p class="page-header__subtitle">{subtitle}</p>
	{/if}
</header>

<style>
	.page-header {
		padding: 1.75rem 1.25rem 0.75rem;
	}

	.page-header__title {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 2.2rem;
		font-weight: 800;
		color: #ffffff;
		margin: 0;
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.page-header__subtitle {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.95rem;
		color: rgba(196, 181, 253, 0.6);
		margin: 0.3rem 0 0;
		font-weight: 500;
	}
</style>
