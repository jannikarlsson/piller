<script lang="ts">
	import { t } from '$lib/i18n';
	import { userStore } from '$lib/stores/auth';
	import { withErrorToast } from '$lib/stores/toast';
	import { medicationsStore, medicationsLoading } from '$lib/stores/medications';
	import { setPicked, resetPicked } from '$lib/firebase';
	import Page from '$lib/components/layout/Page.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import MedicationInfo from '$lib/components/ui/MedicationInfo.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	const medications = $derived($medicationsStore.filter((m) => m.inPillOrganizer));
	const loading = $derived($medicationsLoading);
	const pickedCount = $derived(medications.filter((m) => m.picked).length);
	const allPicked = $derived(medications.length > 0 && pickedCount === medications.length);

	async function toggle(id: string, picked: boolean) {
		const user = $userStore;
		if (!user) return;
		await withErrorToast(() => setPicked(user.uid, id, picked));
	}

	async function handleReset() {
		const user = $userStore;
		if (!user) return;
		await withErrorToast(() => resetPicked(user.uid), t.errors.resetFailed);
	}
</script>

<Page title={t.picking.title} subtitle={t.picking.subtitle} {loading}>
	{#snippet actions()}
		{#if medications.length > 0}
			<Button
				variant="ghost"
				size="sm"
				ariaLabel={t.picking.resetLabel}
				disabled={pickedCount === 0}
				onclick={handleReset}
			>
				<Icon name="reset" />
				{t.picking.resetButton}
			</Button>
		{/if}
	{/snippet}

	{#if $medicationsStore.length === 0}
		<EmptyState
			icon="organizer"
			message={t.common.noMedications}
			actionLabel={t.common.addMedication}
			actionHref="/profile/medications"
		/>
	{:else if medications.length === 0}
		<EmptyState
			icon="organizer"
			message={t.picking.emptyNoneInOrganizer}
			actionLabel={t.picking.emptyNoneInOrganizerAction}
			actionHref="/profile/medications"
		/>
	{:else}
		<div class="checklist">
			<p class="progress text-label" class:progress--done={allPicked} aria-live="polite">
				{#if allPicked}
					<Icon name="check" size="sm" weight="bold" />
					{t.picking.allDone}
				{:else}
					{t.picking.progress(pickedCount, medications.length)}
				{/if}
			</p>

			<Card list as="ul">
				{#each medications as med (med.id)}
					<li>
						<Checkbox checked={med.picked} onchange={(picked) => toggle(med.id, picked)}>
							<MedicationInfo medication={med} layout="inline" done={med.picked} />
						</Checkbox>
					</li>
				{/each}
			</Card>
		</div>
	{/if}
</Page>

<style>
	.checklist {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.progress {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: 0 var(--space-1);
	}

	.progress--done {
		color: var(--color-ok);
	}
</style>
