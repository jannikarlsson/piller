<!--
	A question with a cancel and a confirm button, shown inside a BottomSheet.
	The page does the actual work in `onconfirm`; if it throws, `errorMessage` is shown
	and the dialog stays open.
-->
<script lang="ts">
	import { t } from '$lib/i18n/sv';

	interface Props {
		message: string;
		confirmLabel: string;
		cancelLabel?: string;
		/** `danger` makes the confirm button red, for destructive actions. */
		tone?: 'primary' | 'danger';
		errorMessage?: string;
		onconfirm: () => Promise<void>;
		oncancel: () => void;
	}

	let {
		message,
		confirmLabel,
		cancelLabel = t.common.cancel,
		tone = 'primary',
		errorMessage = t.errors.saveFailed,
		onconfirm,
		oncancel
	}: Props = $props();

	let busy = $state(false);
	let error = $state<string | null>(null);

	async function handleConfirm() {
		busy = true;
		error = null;
		try {
			await onconfirm();
		} catch (e) {
			console.error(e);
			error = errorMessage;
		} finally {
			busy = false;
		}
	}
</script>

<div class="confirm">
	<p class="confirm__message">{message}</p>

	{#if error}
		<p class="confirm__error" role="alert">{error}</p>
	{/if}

	<div class="confirm__actions">
		<button type="button" class="btn btn--secondary" onclick={oncancel} disabled={busy}>
			{cancelLabel}
		</button>
		<button type="button" class="btn btn--{tone}" onclick={handleConfirm} disabled={busy}>
			{busy ? t.common.loading : confirmLabel}
		</button>
	</div>
</div>

<style>
	.confirm {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.confirm__message {
		font-size: 16px;
		line-height: 1.5;
		color: var(--color-text-secondary);
	}

	.confirm__error {
		padding: 12px 14px;
		background: var(--color-danger-bg);
		border: 1px solid var(--color-danger-border);
		border-radius: var(--radius-control);
		font-size: 14px;
		color: var(--color-danger);
	}

	.confirm__actions {
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

	.btn--danger {
		background: var(--color-danger);
		color: #ffffff;
		border: none;
	}

	.btn--secondary {
		background: var(--color-surface);
		color: var(--color-text);
		border: 1px solid var(--color-border);
	}
</style>
