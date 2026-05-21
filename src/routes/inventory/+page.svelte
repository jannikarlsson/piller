<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { userStore } from '$lib/stores/auth';
	import { medicationsStore, medicationsLoading } from '$lib/stores/medications';
	import { updateTileState, nextTileState } from '$lib/firebase';
	import MedicationTile from '$lib/components/MedicationTile.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PillDecor from '$lib/components/PillDecor.svelte';
	import { goto } from '$app/navigation';

	const medications = $derived($medicationsStore);
	const loading = $derived($medicationsLoading);

	async function handleTap(id: string) {
		const user = $userStore;
		if (!user) return;
		const med = medications.find((m) => m.id === id);
		if (!med) return;
		await updateTileState(user.uid, id, 'inventoryState', nextTileState(med.inventoryState));
	}
</script>

<div class="page">
	<PillDecor count={5} />
	<div class="page-inner">
		<PageHeader title={t.inventory.title} subtitle={t.inventory.subtitle} />

		{#if loading}
			<div class="loading">💊 💊 💊</div>
		{:else if medications.length === 0}
			<div class="empty">
				<div class="empty__icon">🏠</div>
				<p>{t.inventory.empty}</p>
				<button class="add-btn" onclick={() => goto('/medications')}>
					{t.inventory.emptyAction}
				</button>
			</div>
		{:else}
			<div class="tile-list">
				{#each medications as med (med.id)}
					<MedicationTile medication={med} mode="inventory" ontap={handleTap} />
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.page {
		position: relative;
		flex: 1;
		overflow: hidden;
	}

	.page-inner {
		position: relative;
		z-index: 1;
		height: 100%;
		overflow-y: auto;
		padding-bottom: calc(70px + env(safe-area-inset-bottom, 0px));
	}

	.tile-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
	}

	.loading {
		text-align: center;
		padding: 3rem;
		font-size: 1.5rem;
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 3rem 2rem;
		text-align: center;
	}

	.empty__icon {
		font-size: 3rem;
		opacity: 0.5;
	}

	.empty p {
		font-family: 'Bricolage Grotesque', sans-serif;
		color: rgba(196, 181, 253, 0.6);
	}

	.add-btn {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.95rem;
		padding: 0.6rem 1.5rem;
		background: #7C3AED;
		color: white;
		border: none;
		border-radius: 2rem;
		cursor: pointer;
	}
</style>
