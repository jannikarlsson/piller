<script lang="ts">
	import { t } from '#lib/i18n/index.ts';
	import { statusOf, type Medication, type StatusKind } from '#lib/models/index.ts';
	import StatusTag from '#lib/components/ui/StatusTag.svelte';
	import MedicationInfo from './MedicationInfo.svelte';

	interface Props {
		medication: Medication;
		kind: StatusKind;
		ontap: (id: string) => void;
	}

	let { medication, kind, ontap }: Props = $props();

	const status = $derived(statusOf(medication, kind));
</script>

<button type="button" class="tile" onclick={() => ontap(medication.id)}>
	<MedicationInfo {medication} />
	{#if status !== 'neutral'}
		<StatusTag tone={status === 'available' ? 'ok' : 'danger'} label={t.statuses[kind][status]} />
	{/if}
</button>

<style>
	.tile {
		display: flex;
		/* Tag at the top, next to the name, however many detail lines there are */
		align-items: flex-start;
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

	/* Rows fill a card that clips anything outside it, so the focus ring sits inside the row,
	   rounded like the card so its corners aren't cut off in the first and last row */
	.tile:focus-visible {
		outline-offset: -2px;
		border-radius: var(--radius-row-focus);
	}

	.tile:active {
		background: var(--color-accent-soft);
	}
</style>
