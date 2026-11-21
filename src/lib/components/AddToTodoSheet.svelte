<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { userStore } from '$lib/stores/auth';
	import { setAddedToTodo, type Medication } from '$lib/firebase';
	import BottomSheet from './BottomSheet.svelte';

	interface Props {
		mode: 'inventory' | 'prescription';
		medication: Medication;
		onclose: () => void;
	}

	let { mode, medication, onclose }: Props = $props();

	let saving = $state(false);
	let error = $state<string | null>(null);

	async function handleAdd() {
		const user = $userStore;
		if (!user) return;
		saving = true;
		error = null;
		try {
			await setAddedToTodo(
				user.uid,
				medication.id,
				mode === 'inventory' ? 'inventoryState' : 'prescriptionState',
				true
			);
			onclose();
		} catch {
			error = t.errors.updateFailed;
		} finally {
			saving = false;
		}
	}
</script>

<BottomSheet
	title={mode === 'inventory' ? t.todoPrompt.buyTitle : t.todoPrompt.prescriptionTitle}
	{onclose}
>
	<p class="text">
		{mode === 'inventory'
			? t.todoPrompt.buyText(medication.name)
			: t.todoPrompt.prescriptionText(medication.name)}
	</p>

	{#if error}
		<p class="error" role="alert">{error}</p>
	{/if}

	<div class="actions">
		<button type="button" class="btn btn--secondary" onclick={onclose} disabled={saving}>
			{t.todoPrompt.decline}
		</button>
		<button type="button" class="btn btn--primary" onclick={handleAdd} disabled={saving}>
			{saving ? t.common.loading : t.todoPrompt.confirm}
		</button>
	</div>
</BottomSheet>

<style>
	.text {
		font-size: 16px;
		line-height: 1.5;
		color: var(--color-text-secondary);
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
</style>
