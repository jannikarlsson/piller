<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { statusOf, type Medication, type StatusKind } from '$lib/firebase';
	import StatusTag from './StatusTag.svelte';
	import MedicationInfo from './MedicationInfo.svelte';

	interface Props {
		medication: Medication;
		kind: StatusKind;
		ontap: (id: string) => void;
	}

	let { medication, kind, ontap }: Props = $props();

	const state = $derived(statusOf(medication, kind));
</script>

<button type="button" class="tile" onclick={() => ontap(medication.id)}>
	<MedicationInfo {medication} />
	{#if state !== 'neutral'}
		<StatusTag tone={state === 'available' ? 'ok' : 'danger'} label={t.tileStates[kind][state]} />
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
</style>
