<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { medicationsStore, medicationsLoading } from '$lib/stores/medications';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PillDecor from '$lib/components/PillDecor.svelte';

	const medications = $derived($medicationsStore);
	const loading = $derived($medicationsLoading);

	const needsBuy = $derived(medications.filter((m) => m.inventoryState === 'out'));
	const needsPrescription = $derived(medications.filter((m) => m.prescriptionState === 'out'));
	const allGood = $derived(needsBuy.length === 0 && needsPrescription.length === 0);
</script>

<div class="page">
	<PillDecor count={5} />
	<div class="page-inner">
		<PageHeader title={t.actions.title} subtitle={t.actions.subtitle} />

		{#if loading}
			<div class="loading">✨ ✨ ✨</div>
		{:else if allGood}
			<div class="all-good">
				<div class="all-good__icon">🎉</div>
				<p class="all-good__title">{t.actions.allGood}</p>
				<p class="all-good__sub">{t.actions.allGoodSub}</p>
			</div>
		{:else}
			<div class="columns">
				{#if needsBuy.length > 0}
					<section class="column column--buy">
						<h2 class="column__heading">{t.actions.buyHeading}</h2>
						<ul class="action-list">
							{#each needsBuy as med (med.id)}
								<li class="action-item action-item--buy">
									<span class="action-item__name">{med.name}</span>
									{#if med.concentration}
										<span class="action-item__conc">{med.concentration}</span>
									{/if}
								</li>
							{/each}
						</ul>
					</section>
				{/if}

				{#if needsPrescription.length > 0}
					<section class="column column--rx">
						<h2 class="column__heading">{t.actions.prescriptionHeading}</h2>
						<ul class="action-list">
							{#each needsPrescription as med (med.id)}
								<li class="action-item action-item--rx">
									<span class="action-item__name">{med.name}</span>
									{#if med.concentration}
										<span class="action-item__conc">{med.concentration}</span>
									{/if}
								</li>
							{/each}
						</ul>
					</section>
				{/if}
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

	.all-good {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 4rem 2rem;
		text-align: center;
	}

	.all-good__icon {
		font-size: 4rem;
		animation: bounce 2s ease-in-out infinite;
	}

	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	.all-good__title {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 1.4rem;
		font-weight: 800;
		color: #ffffff;
	}

	.all-good__sub {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.85rem;
		color: rgba(196, 181, 253, 0.6);
		line-height: 1.5;
	}

	.columns {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1rem 1.25rem;
	}

	.column {
		border-radius: 1.1rem;
		padding: 1.1rem;
		overflow: hidden;
	}

	.column--buy {
		background: #173D2B;
	}

	.column--rx {
		background: #3D1520;
	}

	.column__heading {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 1.15rem;
		font-weight: 800;
		color: #ffffff;
		margin-bottom: 0.75rem;
		letter-spacing: -0.01em;
	}

	.action-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.action-item {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.7rem 0.9rem;
		border-radius: 0.75rem;
		background: rgba(0, 0, 0, 0.2);
	}

	.action-item__name {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 1.05rem;
		font-weight: 700;
		color: #ffffff;
	}

	.action-item__conc {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.5);
		font-weight: 500;
	}
</style>
