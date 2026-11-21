<script lang="ts">
	import { t } from '$lib/i18n/sv';
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
			available:
				mode === 'inventory' ? t.tileStates.inventoryAvailable : t.tileStates.prescriptionAvailable,
			out: mode === 'inventory' ? t.tileStates.inventoryOut : t.tileStates.prescriptionOut
		}[state]
	);
</script>

<button type="button" class="tile" onclick={() => ontap(medication.id)}>
	<span class="tile__main">
		<span class="text-name">{medication.name}</span>
		{#if medication.concentration}
			<span class="text-meta">{medication.concentration}</span>
		{/if}
		{#if medication.alternativeNames.length > 0}
			<span class="text-caption">{medication.alternativeNames.join(', ')}</span>
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
		gap: var(--space-3);
		width: 100%;
		min-height: var(--row-height-tall);
		padding: var(--row-padding-y) var(--row-padding-x);
		background: transparent;
		border: none;
		text-align: left;
		transition: background-color var(--transition-fast);
	}

	.tile:active {
		background: var(--color-accent-soft);
	}

	.tile__main {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}

</style>
