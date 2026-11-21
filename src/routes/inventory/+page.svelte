<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { userStore } from '$lib/stores/auth';
	import { medicationsStore, medicationsLoading } from '$lib/stores/medications';
	import { updateTileState, nextTileState } from '$lib/firebase';
	import MedicationTile from '$lib/components/MedicationTile.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ListCard from '$lib/components/ListCard.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import ResetSheet from '$lib/components/ResetSheet.svelte';

	const medications = $derived($medicationsStore);
	const loading = $derived($medicationsLoading);
	const hasStatuses = $derived(medications.some((m) => m.inventoryState !== 'neutral'));
	let showReset = $state(false);

	async function handleTap(id: string) {
		const user = $userStore;
		if (!user) return;
		const med = medications.find((m) => m.id === id);
		if (!med) return;
		await updateTileState(user.uid, id, 'inventoryState', nextTileState(med.inventoryState));
	}
</script>

<div class="page">
	<PageHeader title={t.inventory.title} subtitle={t.inventory.subtitle}>
		{#snippet actions()}
			{#if medications.length > 0}
				<button
					type="button"
					class="reset-btn"
					onclick={() => (showReset = true)}
					disabled={!hasStatuses}
					aria-label={t.inventory.resetLabel}
				>
					<Icon name="reset" size={18} />
					{t.inventory.resetButton}
				</button>
			{/if}
		{/snippet}
	</PageHeader>

	{#if loading}
		<p class="status-text">{t.common.loading}</p>
	{:else if medications.length === 0}
		<div class="empty">
			<span class="empty__icon"><Icon name="cabinet" size={32} /></span>
			<p>{t.inventory.empty}</p>
			<a class="empty__action" href="/medications">{t.inventory.emptyAction}</a>
		</div>
	{:else}
		<div class="content">
			<ListCard>
				{#each medications as med (med.id)}
					<MedicationTile medication={med} mode="inventory" ontap={handleTap} />
				{/each}
			</ListCard>
		</div>
	{/if}
</div>

{#if showReset}
	<ResetSheet mode="inventory" {medications} onclose={() => (showReset = false)} />
{/if}

<style>
	.page {
		flex: 1;
		overflow-y: auto;
		padding-bottom: calc(var(--nav-height) + 16px + env(safe-area-inset-bottom, 0px));
	}

	.reset-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		height: 44px;
		padding: 0 12px;
		background: transparent;
		border: none;
		border-radius: var(--radius-control);
		font-size: 14px;
		font-weight: 500;
		color: var(--color-accent);
	}

	.reset-btn:active:not(:disabled) {
		background: var(--color-accent-soft);
	}

	.reset-btn:disabled {
		color: var(--color-text-subtle);
		opacity: 0.6;
		cursor: not-allowed;
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
