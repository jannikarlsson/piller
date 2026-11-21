<script lang="ts">
	import { untrack } from 'svelte';
	import { t } from '$lib/i18n';
	import { DEFAULT_MEDICATION_SETTINGS, type MedicationInput } from '$lib/models';
	import { settingsStore } from '$lib/stores/settings';
	import Checkbox from '$lib/components/inputs/Checkbox.svelte';
	import TextField from '$lib/components/inputs/TextField.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ButtonRow from '$lib/components/ui/ButtonRow.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	interface Props {
		initial?: Partial<MedicationInput>;
		onSave: (data: MedicationInput) => Promise<void>;
		onCancel: () => void;
		saving?: boolean;
	}

	let { initial = {}, onSave, onCancel, saving = false }: Props = $props();

	const _init = untrack(() => ({
		name: initial.name ?? '',
		concentration: initial.concentration ?? '',
		alts: (initial.alternativeNames ?? []).join(', '),
		description: initial.description ?? '',
		remindToBuy: initial.remindToBuy ?? DEFAULT_MEDICATION_SETTINGS.remindToBuy,
		remindPrescription:
			initial.remindPrescription ?? DEFAULT_MEDICATION_SETTINGS.remindPrescription,
		inPillOrganizer: initial.inPillOrganizer ?? DEFAULT_MEDICATION_SETTINGS.inPillOrganizer
	}));
	let name = $state(_init.name);
	let concentration = $state(_init.concentration);
	let alternativeNamesRaw = $state(_init.alts);
	let description = $state(_init.description);
	let remindToBuy = $state(_init.remindToBuy);
	let remindPrescription = $state(_init.remindPrescription);
	let inPillOrganizer = $state(_init.inPillOrganizer);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const alts = alternativeNamesRaw
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		await onSave({
			name: name.trim(),
			concentration: concentration.trim(),
			alternativeNames: alts,
			description: description.trim(),
			remindToBuy,
			remindPrescription,
			inPillOrganizer
		});
	}
</script>

<form class="med-form" onsubmit={handleSubmit}>
	<TextField
		label={t.medications.nameLabel}
		placeholder={t.medications.namePlaceholder}
		bind:value={name}
		required
	/>
	<TextField
		label={t.medications.concentrationLabel}
		placeholder={t.medications.concentrationPlaceholder}
		bind:value={concentration}
	/>
	<TextField
		label={t.medications.alternativeNamesLabel}
		placeholder={t.medications.alternativeNamesPlaceholder}
		bind:value={alternativeNamesRaw}
	/>
	<TextField
		label={t.medications.descriptionLabel}
		placeholder={t.medications.descriptionPlaceholder}
		bind:value={description}
		multiline
	/>

	<fieldset class="form-options">
		<legend class="text-label">
			{$settingsStore.showPillOrganizer
				? t.medications.settingsLegend
				: t.medications.settingsLegendReminders}
		</legend>
		<!-- Options for switched-off features are hidden, but their saved values are kept -->
		<Card list>
			<Checkbox label={t.medications.remindToBuyLabel} bind:checked={remindToBuy} />
			{#if $settingsStore.showPrescriptions}
				<Checkbox label={t.medications.remindPrescriptionLabel} bind:checked={remindPrescription} />
			{/if}
			{#if $settingsStore.showPillOrganizer}
				<Checkbox label={t.medications.inPillOrganizerLabel} bind:checked={inPillOrganizer} />
			{/if}
		</Card>
	</fieldset>

	<ButtonRow>
		<Button variant="secondary" onclick={onCancel} disabled={saving}>
			{t.common.cancel}
		</Button>
		<Button type="submit" disabled={saving || !name.trim()}>
			{saving ? t.common.loading : t.medications.saveButton}
		</Button>
	</ButtonRow>
</form>

<style>
	.med-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.form-options {
		border: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.form-options legend {
		margin-bottom: var(--space-2);
	}
</style>
