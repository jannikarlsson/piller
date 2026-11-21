<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { userStore } from '$lib/stores/auth';
	import { medicationsStore, medicationsLoading } from '$lib/stores/medications';
	import {
		updateTileState,
		nextTileState,
		resetStates,
		setAddedToTodo,
		type Medication
	} from '$lib/firebase';
	import MedicationTile from '$lib/components/ui/MedicationTile.svelte';
	import Page from '$lib/components/layout/Page.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import ListCard from '$lib/components/ui/ListCard.svelte';
	import BottomSheet from '$lib/components/ui/BottomSheet.svelte';
	import ResetDialog from '$lib/components/dialogs/ResetDialog.svelte';
	import ConfirmDialog from '$lib/components/dialogs/ConfirmDialog.svelte';

	const medications = $derived($medicationsStore);
	const loading = $derived($medicationsLoading);
	const hasStatuses = $derived(medications.some((m) => m.inventoryState !== 'neutral'));
	let showReset = $state(false);
	/** Medication just marked out that is not added to the to-do list automatically. */
	let todoPromptFor = $state<Medication | null>(null);

	async function handleTap(id: string) {
		const user = $userStore;
		if (!user) return;
		const med = medications.find((m) => m.id === id);
		if (!med) return;
		const next = nextTileState(med.inventoryState);
		await updateTileState(user.uid, id, 'inventoryState', next);
		// Without the automatic reminder, offer to add it to the to-do list by hand
		if (next === 'out' && !med.remindToBuy) todoPromptFor = med;
	}

	async function handleReset(onlyOut: boolean) {
		const user = $userStore;
		if (!user) return;
		await resetStates(user.uid, 'inventoryState', onlyOut);
		showReset = false;
	}

	async function handleAddToTodo(med: Medication) {
		const user = $userStore;
		if (!user) return;
		await setAddedToTodo(user.uid, med.id, 'inventoryState', true);
		todoPromptFor = null;
	}
</script>

<Page title={t.inventory.title} subtitle={t.inventory.subtitle} {loading}>
	{#snippet actions()}
		{#if medications.length > 0}
			<Button
				variant="ghost"
				size="sm"
				ariaLabel={t.inventory.resetLabel}
				disabled={!hasStatuses}
				onclick={() => (showReset = true)}
			>
				<Icon name="reset" size={18} />
				{t.inventory.resetButton}
			</Button>
		{/if}
	{/snippet}

	{#if medications.length === 0}
		<EmptyState
			icon="cabinet"
			message={t.inventory.empty}
			actionLabel={t.inventory.emptyAction}
			actionHref="/medications"
		/>
	{:else}
		<ListCard>
			{#each medications as med (med.id)}
				<MedicationTile medication={med} mode="inventory" ontap={handleTap} />
			{/each}
		</ListCard>
	{/if}
</Page>

{#if todoPromptFor}
	{@const med = todoPromptFor}
	<BottomSheet title={t.todoPrompt.buyTitle} onclose={() => (todoPromptFor = null)}>
		<ConfirmDialog
			message={t.todoPrompt.buyText(med.name)}
			confirmLabel={t.todoPrompt.confirm}
			cancelLabel={t.todoPrompt.decline}
			errorMessage={t.errors.updateFailed}
			onconfirm={() => handleAddToTodo(med)}
			oncancel={() => (todoPromptFor = null)}
		/>
	</BottomSheet>
{/if}

{#if showReset}
	<BottomSheet title={t.reset.inventoryTitle} onclose={() => (showReset = false)}>
		<ResetDialog
			mode="inventory"
			{medications}
			onconfirm={handleReset}
			oncancel={() => (showReset = false)}
		/>
	</BottomSheet>
{/if}
