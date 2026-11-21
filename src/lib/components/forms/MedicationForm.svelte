<script lang="ts">
	import { untrack } from 'svelte';
	import { t } from '$lib/i18n/sv';
	import { DEFAULT_MEDICATION_SETTINGS, type MedicationInput } from '$lib/firebase';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import Button from '$lib/components/ui/Button.svelte';

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
		remindToBuy: initial.remindToBuy ?? DEFAULT_MEDICATION_SETTINGS.remindToBuy,
		remindPrescription: initial.remindPrescription ?? DEFAULT_MEDICATION_SETTINGS.remindPrescription,
		inPillOrganizer: initial.inPillOrganizer ?? DEFAULT_MEDICATION_SETTINGS.inPillOrganizer
	}));
	let name = $state(_init.name);
	let concentration = $state(_init.concentration);
	let alternativeNamesRaw = $state(_init.alts);
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
			remindToBuy,
			remindPrescription,
			inPillOrganizer
		});
	}
</script>

<form class="med-form" onsubmit={handleSubmit}>
	<div class="form-field">
		<label class="form-label" for="med-name">{t.medications.nameLabel}</label>
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
		<label class="form-label" for="med-conc">{t.medications.concentrationLabel}</label>
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
		<label class="form-label" for="med-alts">{t.medications.alternativeNamesLabel}</label>
		<input
			id="med-alts"
			class="form-input"
			type="text"
			bind:value={alternativeNamesRaw}
			placeholder={t.medications.alternativeNamesPlaceholder}
			autocomplete="off"
		/>
	</div>

	<fieldset class="form-options">
		<legend class="form-label">{t.medications.settingsLegend}</legend>
		<div class="form-options__list">
			<Checkbox label={t.medications.remindToBuyLabel} bind:checked={remindToBuy} />
			<Checkbox label={t.medications.remindPrescriptionLabel} bind:checked={remindPrescription} />
			<Checkbox label={t.medications.inPillOrganizerLabel} bind:checked={inPillOrganizer} />
		</div>
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
		gap: 16px;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.form-label {
		font-size: 14px;
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	.form-input {
		font-size: 16px;
		height: 48px;
		padding: 0 14px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-control);
		color: var(--color-text);
		outline: none;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.form-input::placeholder {
		color: var(--color-placeholder);
	}

	.form-input:focus {
		border-color: var(--color-accent);
		box-shadow: 0 0 0 3px var(--color-accent-ring);
	}

	.form-options {
		border: none;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.form-options .form-label {
		margin-bottom: 6px;
	}

	.form-options__list {
		border: 1px solid var(--color-border);
		border-radius: var(--radius-control);
		overflow: hidden;
	}

	.form-options__list > :global(* + *) {
		border-top: 1px solid var(--color-border-light);
	}

	.form-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		padding-top: 4px;
	}
</style>
