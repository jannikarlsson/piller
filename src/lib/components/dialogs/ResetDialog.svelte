<!--
	Choose which cabinet or prescription statuses to reset, shown inside a BottomSheet.
	The page does the reset in `onconfirm`; if it throws, an error is shown and the dialog stays open.
-->
<script lang="ts">
	import { untrack } from 'svelte';
	import { t } from '$lib/i18n';
	import { statusOf, type Medication, type StatusKind } from '$lib/firebase';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';

	interface Props {
		kind: StatusKind;
		medications: Medication[];
		onconfirm: (onlyOut: boolean) => Promise<void>;
		oncancel: () => void;
	}

	let { kind, medications, onconfirm, oncancel }: Props = $props();

	type Scope = 'out' | 'all';

	const outCount = $derived(medications.filter((m) => statusOf(m, kind) === 'out').length);
	const setCount = $derived(medications.filter((m) => statusOf(m, kind) !== 'neutral').length);

	// Default to "only out" when there is something to clear there, otherwise "all".
	let scope = $state<Scope>(untrack(() => (outCount > 0 ? 'out' : 'all')));
	let submitting = $state(false);
	let error = $state<string | null>(null);

	const selectedCount = $derived(scope === 'out' ? outCount : setCount);

	const options = $derived([
		{
			value: 'out' as const,
			label: t.reset.optionOut[kind],
			count: outCount
		},
		{ value: 'all' as const, label: t.reset.optionAll, count: setCount }
	]);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;
		error = null;
		try {
			await onconfirm(scope === 'out');
		} catch {
			error = t.errors.resetFailed;
		} finally {
			submitting = false;
		}
	}
</script>

<form class="reset-form" onsubmit={handleSubmit}>
	<p class="intro text-body">
		{t.reset.intro[kind]}
	</p>

	<fieldset class="options">
		<legend class="visually-hidden">{t.reset.scopeLegend}</legend>
		<Card list>
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
						<span class="option__count text-meta">{t.reset.count(option.count)}</span>
					</span>
				</label>
			{/each}
		</Card>
	</fieldset>

	{#if error}
		<ErrorMessage message={error} />
	{/if}

	<div class="actions">
		<Button variant="secondary" onclick={oncancel} disabled={submitting}>
			{t.common.cancel}
		</Button>
		<Button type="submit" disabled={submitting || selectedCount === 0}>
			{submitting ? t.common.loading : t.reset.confirm}
		</Button>
	</div>
</form>

<style>
	.reset-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.intro {
		color: var(--color-text-muted);
	}

	.options {
		border: none;
	}

	.option {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-height: var(--row-height);
		padding: var(--row-padding-y) var(--row-padding-x);
		cursor: pointer;
		transition: background-color var(--transition-fast);
	}

	.option:has(input:checked) {
		background: var(--color-accent-soft);
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
		gap: var(--space-3);
	}

	.option__label {
		font-size: var(--text-md);
		font-weight: 500;
	}

	.option__count {
		white-space: nowrap;
	}

	.actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-3);
		padding-top: var(--space-1);
	}
</style>
