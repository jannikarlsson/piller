<script lang="ts">
	import type { Medication } from '$lib/firebase';
	import StatusTag from './StatusTag.svelte';

	interface Props {
		medication: Medication;
		mode: 'inventory' | 'prescription';
		ontap: (id: string) => void;
	}

	let { medication, mode, ontap }: Props = $props();

	const state = $derived(
		mode === 'inventory' ? medication.inventoryState : medication.prescriptionState
	);

	const stateLabel = $derived(
		{
			neutral: '',
			available: mode === 'inventory' ? 'Hemma' : 'Aktivt',
			out: mode === 'inventory' ? 'Slut' : 'Inget recept'
		}[state]
	);
</script>

<button type="button" class="tile" onclick={() => ontap(medication.id)}>
	<span class="tile__main">
		<span class="tile__name">{medication.name}</span>
		{#if medication.concentration}
			<span class="tile__concentration">{medication.concentration}</span>
		{/if}
		{#if medication.alternativeNames.length > 0}
			<span class="tile__alt">{medication.alternativeNames.join(', ')}</span>
		{/if}
	</span>
	{#if state !== 'neutral'}
		<StatusTag tone={state === 'available' ? 'ok' : 'danger'} label={stateLabel} />
	{/if}
</button>

<style>
	.tile {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		width: 100%;
		min-height: 68px;
		padding: 12px 16px;
		background: transparent;
		border: none;
		text-align: left;
		transition: background-color 0.12s ease;
	}

	.tile:active {
		background: var(--color-accent-soft);
	}

	.tile__main {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.tile__name {
		font-size: 16px;
		font-weight: 600;
	}

	.tile__concentration {
		font-size: 14px;
		color: var(--color-text-muted);
	}

	.tile__alt {
		font-size: 13px;
		color: var(--color-text-subtle);
	}
</style>
