<script lang="ts">
	import { untrack } from 'svelte';
	import { t } from '#lib/i18n/index.ts';
	import { statusOf, type Medication, type StatusKind } from '#lib/models/index.ts';
	import Button from '#lib/components/ui/Button.svelte';
	import ButtonRow from '#lib/components/ui/ButtonRow.svelte';
	import ErrorMessage from '#lib/components/ui/ErrorMessage.svelte';
	import RadioGroup from '#lib/components/inputs/RadioGroup.svelte';

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

	let scope = $state<Scope>(untrack(() => (outCount > 0 ? 'out' : 'all')));
	let submitting = $state(false);
	let error = $state<string | null>(null);

	const selectedCount = $derived(scope === 'out' ? outCount : setCount);

	const options = $derived([
		{
			value: 'out' as const,
			label: t.reset.optionOut[kind],
			detail: t.reset.count(outCount),
			disabled: outCount === 0
		},
		{
			value: 'all' as const,
			label: t.reset.optionAll,
			detail: t.reset.count(setCount),
			disabled: setCount === 0
		}
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

	<RadioGroup
		legend={t.reset.scopeLegend}
		{options}
		selected={scope}
		onselect={(value) => (scope = value)}
	/>

	{#if error}
		<ErrorMessage message={error} />
	{/if}

	<ButtonRow>
		<Button variant="secondary" onclick={oncancel} disabled={submitting}>
			{t.common.cancel}
		</Button>
		<Button type="submit" disabled={submitting || selectedCount === 0}>
			{submitting ? t.common.loading : t.reset.confirm}
		</Button>
	</ButtonRow>
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
</style>
