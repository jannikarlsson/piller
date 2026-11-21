<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { userStore } from '$lib/stores/auth';
	import { medicationsStore, medicationsLoading } from '$lib/stores/medications';
	import { setPicked, resetPicked } from '$lib/firebase';
	import Page from '$lib/components/layout/Page.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import ListCard from '$lib/components/ui/ListCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	const medications = $derived($medicationsStore.filter((m) => m.inPillOrganizer));
	const loading = $derived($medicationsLoading);
	const pickedCount = $derived(medications.filter((m) => m.picked).length);
	const allPicked = $derived(medications.length > 0 && pickedCount === medications.length);

	async function toggle(id: string, picked: boolean) {
		const user = $userStore;
		if (!user) return;
		try {
			await setPicked(user.uid, id, picked);
		} catch (e) {
			console.error(e);
		}
	}

	async function handleReset() {
		const user = $userStore;
		if (!user) return;
		try {
			await resetPicked(user.uid);
		} catch (e) {
			console.error(e);
		}
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
				<Icon name="reset" size={18} />
				{t.picking.resetButton}
			</Button>
		{/if}
	{/snippet}

	{#if $medicationsStore.length === 0}
		<EmptyState
			icon="organizer"
			message={t.picking.empty}
			actionLabel={t.picking.emptyAction}
			actionHref="/medications"
		/>
	{:else if medications.length === 0}
		<EmptyState
			icon="organizer"
			message={t.picking.emptyNoneInOrganizer}
			actionLabel={t.picking.emptyNoneInOrganizerAction}
			actionHref="/medications"
		/>
	{:else}
		<div class="checklist">
			<p class="progress text-label" class:progress--done={allPicked} aria-live="polite">
				{#if allPicked}
					<Icon name="check" size={16} strokeWidth={2.25} />
					{t.picking.allDone}
				{:else}
					{t.picking.progress(pickedCount, medications.length)}
				{/if}
			</p>

			<ListCard as="ul">
				{#each medications as med (med.id)}
					<li>
						<Checkbox checked={med.picked} onchange={(picked) => toggle(med.id, picked)}>
							<span class="item" class:item--done={med.picked}>
								<span class="item__name text-name">{med.name}</span>
								{#if med.concentration}
									<span class="text-meta">{med.concentration}</span>
								{/if}
							</span>
						</Checkbox>
					</li>
				{/each}
			</ListCard>
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

	.item {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: var(--space-2);
	}

	.item--done .item__name {
		color: var(--color-text-subtle);
		text-decoration: line-through;
	}
</style>
