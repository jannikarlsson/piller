<script lang="ts">
	import { untrack } from 'svelte';
	import { t } from '$lib/i18n/sv';
	import { userStore } from '$lib/stores/auth';
	import { resetStates, type Medication } from '$lib/firebase';
	import BottomSheet from './BottomSheet.svelte';

	interface Props {
		mode: 'inventory' | 'prescription';
		medications: Medication[];
		onclose: () => void;
	}

	let { mode, medications, onclose }: Props = $props();

	type Scope = 'out' | 'all';

	const field = $derived(mode === 'inventory' ? 'inventoryState' : 'prescriptionState');
	const outCount = $derived(medications.filter((m) => m[field] === 'out').length);
	const setCount = $derived(medications.filter((m) => m[field] !== 'neutral').length);

	// Default to "only out" when there is something to clear there, otherwise "all".
	let scope = $state<Scope>(untrack(() => (outCount > 0 ? 'out' : 'all')));
	let submitting = $state(false);
	let error = $state<string | null>(null);

	const selectedCount = $derived(scope === 'out' ? outCount : setCount);

	const options = $derived([
		{
			value: 'out' as const,
			label: mode === 'inventory' ? t.reset.optionOutInventory : t.reset.optionOutPrescription,
			count: outCount
		},
		{ value: 'all' as const, label: t.reset.optionAll, count: setCount }
	]);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const user = $userStore;
		if (!user) return;
		submitting = true;
		error = null;
		try {
			await resetStates(user.uid, field, scope === 'out');
			onclose();
		} catch {
			error = t.errors.resetFailed;
		} finally {
			submitting = false;
		}
	}
</script>

<BottomSheet
	title={mode === 'inventory' ? t.reset.inventoryTitle : t.reset.prescriptionTitle}
	{onclose}
>
	<form class="reset-form" onsubmit={handleSubmit}>
		<p class="intro">
			{mode === 'inventory' ? t.reset.inventoryIntro : t.reset.prescriptionIntro}
		</p>

		<fieldset class="options">
			<legend class="visually-hidden">{t.reset.scopeLegend}</legend>
			{#each options as option (option.value)}
				<label class="option" class:option--disabled={option.count === 0}>
					<input
						type="radio"
						name="reset-scope"
						value={option.value}
						bind:group={scope}
						disabled={option.count === 0}
					/>
					<span class="option__text">
						<span class="option__label">{option.label}</span>
						<span class="option__count">{t.reset.count(option.count)}</span>
					</span>
				</label>
			{/each}
		</fieldset>

		{#if error}
			<p class="error" role="alert">{error}</p>
		{/if}

		<div class="actions">
			<button type="button" class="btn btn--secondary" onclick={onclose} disabled={submitting}>
				{t.reset.cancel}
			</button>
			<button type="submit" class="btn btn--primary" disabled={submitting || selectedCount === 0}>
				{submitting ? t.common.loading : t.reset.confirm}
			</button>
		</div>
	</form>
</BottomSheet>

<style>
	.reset-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.intro {
		font-size: 15px;
		line-height: 1.5;
		color: var(--color-text-muted);
	}

	.options {
		border: none;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.option {
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 56px;
		padding: 8px 14px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-control);
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.option:has(input:checked) {
		border-color: var(--color-accent);
		box-shadow: 0 0 0 3px var(--color-accent-ring);
	}

	.option--disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.option input {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		margin: 0;
		accent-color: var(--color-accent);
	}

	.option__text {
		display: flex;
		flex: 1;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
	}

	.option__label {
		font-size: 16px;
		font-weight: 500;
	}

	.option__count {
		font-size: 14px;
		color: var(--color-text-muted);
		white-space: nowrap;
	}

	.error {
		padding: 12px 14px;
		background: var(--color-danger-bg);
		border: 1px solid var(--color-danger-border);
		border-radius: var(--radius-control);
		font-size: 14px;
		color: var(--color-danger);
	}

	.actions {
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

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}
</style>
