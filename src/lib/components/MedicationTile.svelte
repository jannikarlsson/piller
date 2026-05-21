<script lang="ts">
	import type { Medication } from '$lib/firebase';

	interface Props {
		medication: Medication;
		mode: 'inventory' | 'prescription';
		ontap: (id: string) => void;
	}

	let { medication, mode, ontap }: Props = $props();

	const state = $derived(
		mode === 'inventory' ? medication.inventoryState : medication.prescriptionState
	);

	const stateClass = $derived({
		neutral: 'tile--neutral',
		available: 'tile--available',
		out: 'tile--out'
	}[state]);

	const stateLabel = $derived({
		neutral: '',
		available: mode === 'inventory' ? '✓ Hemma' : '✓ Aktivt',
		out: mode === 'inventory' ? 'Slut' : 'Inget recept'
	}[state]);
</script>

<button
	class="tile {stateClass}"
	onclick={() => ontap(medication.id)}
	aria-label="{medication.name} – {state}"
>
	<div class="tile__main">
		<span class="tile__name">{medication.name}</span>
		<div class="tile__meta">
			{#if medication.concentration}
				<span class="tile__concentration">{medication.concentration}</span>
			{/if}
			{#if medication.alternativeNames.length > 0}
				<span class="tile__alt">{medication.alternativeNames.join(', ')}</span>
			{/if}
		</div>
	</div>
	{#if stateLabel}
		<span class="tile__badge">{stateLabel}</span>
	{/if}
</button>

<style>
	.tile {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 1.1rem 1.25rem;
		border-radius: 1.1rem;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: transform 0.12s ease, filter 0.12s ease;
		-webkit-tap-highlight-color: transparent;
	}

	.tile:active {
		transform: scale(0.96);
		filter: brightness(0.9);
	}

	.tile--neutral {
		background: #231848;
	}

	.tile--available {
		background: #173D2B;
	}

	.tile--out {
		background: #3D1520;
	}

	.tile__main {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}

	.tile__name {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-weight: 700;
		font-size: 1.2rem;
		color: #ffffff;
		line-height: 1.15;
	}

	.tile__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		align-items: center;
	}

	.tile__concentration {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.85rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.55);
	}

	.tile__alt {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.8rem;
		font-weight: 400;
		color: rgba(255, 255, 255, 0.35);
	}

	.tile__badge {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		flex-shrink: 0;
		padding: 0.3rem 0.7rem;
		border-radius: 2rem;
	}

	.tile--available .tile__badge {
		background: #25C97A;
		color: #0a2918;
	}

	.tile--out .tile__badge {
		background: #E05470;
		color: #fff;
	}
</style>
