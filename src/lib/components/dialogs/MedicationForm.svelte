<script lang="ts">
	import { untrack } from 'svelte';
	import { t } from '$lib/i18n';
	import { DEFAULT_MEDICATION_SETTINGS, type MedicationInput } from '$lib/models';
	import { settingsStore } from '$lib/stores/settings';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import Button from '$lib/components/ui/Button.svelte';
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
		remindPrescription: initial.remindPrescription ?? DEFAULT_MEDICATION_SETTINGS.remindPrescription,
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
	<div class="form-field">
		<label class="text-label" for="med-name">{t.medications.nameLabel}</label>
		<input
			id="med-name"
			class="form-input"
			type="text"
			bind:value={name}
			placeholder={t.medications.namePlaceholder}
			required
			autocomplete="off"
		/>
	</div>

	<div class="form-field">
		<label class="text-label" for="med-conc">{t.medications.concentrationLabel}</label>
		<input
			id="med-conc"
			class="form-input"
			type="text"
			bind:value={concentration}
			placeholder={t.medications.concentrationPlaceholder}
			autocomplete="off"
		/>
	</div>

	<div class="form-field">
		<label class="text-label" for="med-alts">{t.medications.alternativeNamesLabel}</label>
		<input
			id="med-alts"
			class="form-input"
			type="text"
			bind:value={alternativeNamesRaw}
			placeholder={t.medications.alternativeNamesPlaceholder}
			autocomplete="off"
		/>
	</div>

	<div class="form-field">
		<label class="text-label" for="med-description">{t.medications.descriptionLabel}</label>
		<textarea
			id="med-description"
			class="form-input form-input--multiline"
			rows="2"
			bind:value={description}
			placeholder={t.medications.descriptionPlaceholder}
		></textarea>
	</div>

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

	<div class="form-actions">
		<Button variant="secondary" onclick={onCancel} disabled={saving}>
			{t.common.cancel}
		</Button>
		<Button type="submit" disabled={saving || !name.trim()}>
			{saving ? t.common.loading : t.medications.saveButton}
		</Button>
	</div>
</form>

<style>
	.med-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.form-input {
		font-size: var(--text-md);
		height: var(--size-control);
		padding: 0 var(--space-4);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-control);
		color: var(--color-text);
		outline: none;
		transition:
			border-color var(--transition-fast),
			box-shadow var(--transition-fast);
	}

	.form-input--multiline {
		height: auto;
		padding: var(--space-3) var(--space-4);
		line-height: var(--leading-normal);
		resize: vertical;
	}

	.form-input::placeholder {
		color: var(--color-placeholder);
	}

	.form-input:focus {
		border-color: var(--color-accent);
		box-shadow: var(--focus-ring);
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

	.form-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
		padding-top: var(--space-1);
	}
</style>
