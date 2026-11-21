<!--
	A question with a cancel and a confirm button, shown inside a BottomSheet.
	The page does the actual work in `onconfirm`; if it throws, `errorMessage` is shown
	and the dialog stays open.
-->
<script lang="ts">
	import { t } from '$lib/i18n';
	import Button from '$lib/components/ui/Button.svelte';
	import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';

	interface Props {
		message: string;
		confirmLabel: string;
		cancelLabel?: string;
		tone?: 'primary' | 'danger';
		errorMessage?: string;
		onconfirm: () => Promise<void>;
		oncancel: () => void;
	}

	let {
		message,
		confirmLabel,
		cancelLabel,
		tone = 'primary',
		errorMessage,
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
			error = errorMessage ?? t.errors.saveFailed;
		} finally {
			busy = false;
		}
	}
</script>

<div class="confirm">
	<p class="confirm__message text-body">{message}</p>

	{#if error}
		<ErrorMessage message={error} />
	{/if}

	<div class="confirm__actions">
		<Button variant="secondary" onclick={oncancel} disabled={busy}>{cancelLabel ?? t.common.cancel}</Button>
		<Button variant={tone} onclick={handleConfirm} disabled={busy}>
			{busy ? t.common.loading : confirmLabel}
		</Button>
	</div>
</div>

<style>
	.confirm {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}

	.confirm__message {
		color: var(--color-text-secondary);
	}

	.confirm__actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
	}
</style>
