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
		<button type="button" class="btn btn--ghost" onclick={onCancel} disabled={saving}>
			{t.medications.cancelButton}
		</button>
		<button type="submit" class="btn btn--primary" disabled={saving || !name.trim()}>
			{saving ? '...' : t.medications.saveButton}
		</button>
	</div>
</form>

<style>
	.med-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.form-label {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		color: #c4b5fd;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.form-input {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 1rem;
		padding: 0.75rem 1rem;
		background: rgba(255, 255, 255, 0.07);
		border: 2px solid rgba(124, 58, 237, 0.3);
		border-radius: 0.875rem;
		color: #f3f0ff;
		outline: none;
		transition: border-color 0.15s ease;
	}

	.form-input::placeholder {
		color: rgba(196, 181, 253, 0.4);
	}

	.form-input:focus {
		border-color: #7c3aed;
	}

	.form-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		padding-top: 0.5rem;
	}

	.btn {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 1rem;
		padding: 0.6rem 1.5rem;
		border: none;
		border-radius: 2rem;
		cursor: pointer;
		transition: transform 0.1s ease, opacity 0.1s ease;
	}

	.btn:active {
		transform: scale(0.95);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn--primary {
		background: #7C3AED;
		color: white;
	}

	.btn--ghost {
		background: rgba(255, 255, 255, 0.08);
		color: #c4b5fd;
		border: 1px solid rgba(196, 181, 253, 0.3);
	}
</style>
