<script lang="ts">
	import { untrack } from 'svelte';
	import { t } from '$lib/i18n/sv';
	import type { MedicationInput } from '$lib/firebase';

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
		alts: (initial.alternativeNames ?? []).join(', ')
	}));
	let name = $state(_init.name);
	let concentration = $state(_init.concentration);
	let alternativeNamesRaw = $state(_init.alts);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const alts = alternativeNamesRaw
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		await onSave({ name: name.trim(), concentration: concentration.trim(), alternativeNames: alts });
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

	<div class="form-actions">
		<button type="button" class="btn btn--secondary" onclick={onCancel} disabled={saving}>
			{t.medications.cancelButton}
		</button>
		<button type="submit" class="btn btn--primary" disabled={saving || !name.trim()}>
			{saving ? t.common.loading : t.medications.saveButton}
		</button>
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

	.form-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		padding-top: 4px;
	}

	.btn {
		font-size: 16px;
		font-weight: 500;
		height: 48px;
		border-radius: var(--radius-control);
		transition: background-color 0.12s ease;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn--primary {
		background: var(--color-accent);
		color: #ffffff;
		border: none;
	}

	.btn--primary:not(:disabled):active {
		background: var(--color-accent-hover);
	}

	.btn--secondary {
		background: var(--color-surface);
		color: var(--color-text);
		border: 1px solid var(--color-border);
	}
</style>
