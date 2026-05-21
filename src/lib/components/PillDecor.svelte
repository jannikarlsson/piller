<script lang="ts">
	interface Props {
		count?: number;
	}
	let { count = 6 }: Props = $props();

	const pills = $derived(Array.from({ length: count }, (_, i) => ({
		id: i,
		x: 5 + (i * 17) % 90,
		y: 5 + (i * 23 + 10) % 85,
		rot: (i * 47) % 360,
		scale: 0.6 + (i % 3) * 0.25,
		color: ['#f97316', '#0d9488', '#7c3aed', '#ec4899', '#eab308'][i % 5]
	})));
</script>

<div class="pill-decor" aria-hidden="true">
	{#each pills as pill (pill.id)}
		<div
			class="pill"
			style="
				left: {pill.x}%;
				top: {pill.y}%;
				transform: rotate({pill.rot}deg) scale({pill.scale});
				opacity: 0.18;
			"
		>
			<svg width="36" height="18" viewBox="0 0 36 18" fill="none">
				<rect x="1" y="1" width="34" height="16" rx="8" fill="{pill.color}" />
				<line x1="18" y1="1" x2="18" y2="17" stroke="white" stroke-width="2" />
				<rect x="1" y="1" width="17" height="16" rx="8" fill="white" fill-opacity="0.25" />
			</svg>
		</div>
	{/each}
</div>

<style>
	.pill-decor {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
		z-index: 0;
	}

	.pill {
		position: absolute;
	}
</style>
