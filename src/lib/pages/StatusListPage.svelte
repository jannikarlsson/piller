<!--
	The Skåpet and Recept pages: a list of medications whose status (cabinet or prescription)
	is changed by tapping. Like routes, files in lib/pages may load and save data.
-->
<script lang="ts">
	import { t } from '$lib/i18n';
	import { withErrorToast } from '$lib/stores/toast';
	import { medicationsStore, medicationsLoading } from '$lib/stores/medications';
	import { updateStatus, resetStatuses, setAddedToTodo } from '$lib/firebase';
	import {
		nextStatus,
		statusOf,
		remindsAutomatically,
		type Medication,
		type StatusKind
	} from '$lib/models';
	import Page from '$lib/components/layout/Page.svelte';
	import MedicationTile from '$lib/components/medication/MedicationTile.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import BottomSheet from '$lib/components/ui/BottomSheet.svelte';
	import ResetDialog from '$lib/components/dialogs/ResetDialog.svelte';
	import ConfirmDialog from '$lib/components/dialogs/ConfirmDialog.svelte';

	interface Props {
		kind: StatusKind;
	}

	let { kind }: Props = $props();

	const EMPTY_ICON = { inventory: 'cabinet', prescription: 'prescription' } as const;

	const text = $derived(t[kind]);
	const medications = $derived($medicationsStore);
	const loading = $derived($medicationsLoading);
	const hasStatuses = $derived(medications.some((m) => statusOf(m, kind) !== 'neutral'));
	let showReset = $state(false);
	let todoPromptFor = $state<Medication | null>(null);

	async function handleTap(id: string) {
		const med = medications.find((m) => m.id === id);
		if (!med) return;
		const next = nextStatus(statusOf(med, kind));
		const saved = await withErrorToast(() => updateStatus(id, kind, next));
		if (!saved) return;
		// Without the automatic reminder, offer to add it to the to-do list by hand
		if (next === 'out' && !remindsAutomatically(med, kind)) todoPromptFor = med;
	}

	async function handleReset(onlyOut: boolean) {
		await resetStatuses(kind, onlyOut);
		showReset = false;
	}

	async function handleAddToTodo(med: Medication) {
		await setAddedToTodo(med.id, kind, true);
		todoPromptFor = null;
	}
</script>

<Page title={text.title} {loading}>
	{#snippet actions()}
		{#if medications.length > 0}
			<Button
				variant="ghost"
				size="sm"
				ariaLabel={text.resetLabel}
				disabled={!hasStatuses}
				onclick={() => (showReset = true)}
			>
				<Icon name="reset" />
				{text.resetButton}
			</Button>
		{/if}
	{/snippet}

	{#if medications.length === 0}
		<EmptyState
			icon={EMPTY_ICON[kind]}
			message={t.common.noMedications}
			actionLabel={t.common.addMedication}
			actionHref="/profile/medications"
		/>
	{:else}
		<Card list>
			{#each medications as med (med.id)}
				<MedicationTile medication={med} {kind} ontap={handleTap} />
			{/each}
		</Card>
	{/if}
</Page>

{#if todoPromptFor}
	{@const med = todoPromptFor}
	<BottomSheet title={t.todoPrompt.title[kind]} onclose={() => (todoPromptFor = null)}>
		<ConfirmDialog
			message={t.todoPrompt.text[kind](med.name)}
			confirmLabel={t.todoPrompt.confirm}
			cancelLabel={t.todoPrompt.decline}
			errorMessage={t.errors.updateFailed}
			onconfirm={() => handleAddToTodo(med)}
			oncancel={() => (todoPromptFor = null)}
		/>
	</BottomSheet>
{/if}

{#if showReset}
	<BottomSheet title={t.reset.title[kind]} onclose={() => (showReset = false)}>
		<ResetDialog {kind} {medications} onconfirm={handleReset} oncancel={() => (showReset = false)} />
	</BottomSheet>
{/if}
