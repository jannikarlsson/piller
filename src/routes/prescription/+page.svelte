<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { userStore } from '$lib/stores/auth';
	import { medicationsStore, medicationsLoading } from '$lib/stores/medications';
	import { updateTileState, nextTileState, type Medication } from '$lib/firebase';
	import MedicationTile from '$lib/components/MedicationTile.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ListCard from '$lib/components/ListCard.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import ResetSheet from '$lib/components/ResetSheet.svelte';
	import ResetButton from '$lib/components/ResetButton.svelte';
	import AddToTodoSheet from '$lib/components/AddToTodoSheet.svelte';

	const medications = $derived($medicationsStore);
	const loading = $derived($medicationsLoading);
	const hasStatuses = $derived(medications.some((m) => m.prescriptionState !== 'neutral'));
	let showReset = $state(false);
	/** Medication just marked out that is not added to the to-do list automatically. */
	let todoPromptFor = $state<Medication | null>(null);

	async function handleTap(id: string) {
		const user = $userStore;
		if (!user) return;
		const med = medications.find((m) => m.id === id);
		if (!med) return;
		const next = nextTileState(med.prescriptionState);
		await updateTileState(user.uid, id, 'prescriptionState', next);
		// Without the automatic reminder, offer to add it to the to-do list by hand
		if (next === 'out' && !med.remindPrescription) todoPromptFor = med;
	}
</script>

<div class="page">
	<PageHeader title={t.prescription.title} subtitle={t.prescription.subtitle}>
		{#snippet actions()}
			{#if medications.length > 0}
				<ResetButton
					label={t.prescription.resetButton}
					ariaLabel={t.prescription.resetLabel}
					disabled={!hasStatuses}
					onclick={() => (showReset = true)}
				/>
			{/if}
		{/snippet}
	</PageHeader>

	{#if loading}
		<p class="status-text">{t.common.loading}</p>
	{:else if medications.length === 0}
		<div class="empty">
			<span class="empty__icon"><Icon name="prescription" size={32} /></span>
			<p>{t.prescription.empty}</p>
			<a class="empty__action" href="/medications">{t.prescription.emptyAction}</a>
		</div>
	{:else}
		<div class="content">
			<ListCard>
				{#each medications as med (med.id)}
					<MedicationTile medication={med} mode="prescription" ontap={handleTap} />
				{/each}
			</ListCard>
		</div>
	{/if}
</div>

{#if todoPromptFor}
	<AddToTodoSheet mode="prescription" medication={todoPromptFor} onclose={() => (todoPromptFor = null)} />
{/if}

{#if showReset}
	<ResetSheet mode="prescription" {medications} onclose={() => (showReset = false)} />
{/if}

<style>
	.page {
		flex: 1;
		overflow-y: auto;
		padding-bottom: calc(var(--nav-height) + 16px + env(safe-area-inset-bottom, 0px));
	}

	.content {
		padding: 0 16px;
	}

	.status-text {
		padding: 48px 20px;
		text-align: center;
		color: var(--color-text-muted);
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		margin: 0 16px;
		padding: 40px 24px;
		text-align: center;
		background: var(--color-surface);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-card);
		color: var(--color-text-muted);
	}

	.empty__icon {
		color: var(--color-accent);
	}

	.empty__action {
		display: inline-flex;
		align-items: center;
		height: 44px;
		padding: 0 18px;
		margin-top: 4px;
		background: var(--color-accent);
		color: #ffffff;
		border-radius: var(--radius-control);
		font-size: 15px;
		font-weight: 500;
		text-decoration: none;
	}
</style>
