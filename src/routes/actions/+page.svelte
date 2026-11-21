<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { medicationsStore, medicationsLoading } from '$lib/stores/medications';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ListCard from '$lib/components/ListCard.svelte';
	import Icon from '$lib/components/Icon.svelte';

	const medications = $derived($medicationsStore);
	const loading = $derived($medicationsLoading);

	const needsBuy = $derived(
		medications.filter((m) => m.remindToBuy && m.inventoryState === 'out')
	);
	const needsPrescription = $derived(
		medications.filter((m) => m.remindPrescription && m.prescriptionState === 'out')
	);
	const allGood = $derived(needsBuy.length === 0 && needsPrescription.length === 0);

	const sections = $derived(
		[
			{ id: 'buy', heading: t.actions.buyHeading, items: needsBuy },
			{ id: 'rx', heading: t.actions.prescriptionHeading, items: needsPrescription }
		].filter((s) => s.items.length > 0)
	);
</script>

<div class="page">
	<PageHeader title={t.actions.title} subtitle={t.actions.subtitle} />

	{#if loading}
		<p class="status-text">{t.common.loading}</p>
	{:else if allGood}
		<div class="all-good">
			<span class="all-good__icon"><Icon name="check" size={28} strokeWidth={2.25} /></span>
			<p class="all-good__title">{t.actions.allGood}</p>
			<p class="all-good__sub">{t.actions.allGoodSub}</p>
		</div>
	{:else}
		<div class="sections">
			{#each sections as section (section.id)}
				<section class="section" aria-labelledby="heading-{section.id}">
					<h2 class="section__heading" id="heading-{section.id}">
						{section.heading}
						<span class="section__count">{section.items.length}</span>
					</h2>
					<ListCard as="ul">
						{#each section.items as med (med.id)}
							<li class="action-item">
								<span class="action-item__box" aria-hidden="true"></span>
								<span class="action-item__text">
									<span class="action-item__name">{med.name}</span>
									{#if med.concentration}
										<span class="action-item__conc">{med.concentration}</span>
									{/if}
								</span>
							</li>
						{/each}
					</ListCard>
				</section>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page {
		flex: 1;
		overflow-y: auto;
		padding-bottom: calc(var(--nav-height) + 16px + env(safe-area-inset-bottom, 0px));
	}

	.status-text {
		padding: 48px 20px;
		text-align: center;
		color: var(--color-text-muted);
	}

	.all-good {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		margin: 0 16px;
		padding: 40px 24px;
		text-align: center;
		background: var(--color-surface);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-card);
	}

	.all-good__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		margin-bottom: 4px;
		border-radius: 50%;
		background: var(--color-ok-bg);
		color: var(--color-ok);
	}

	.all-good__title {
		font-size: 18px;
		font-weight: 600;
	}

	.all-good__sub {
		font-size: 14px;
		line-height: 1.5;
		color: var(--color-text-muted);
	}

	.sections {
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding: 0 16px;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.section__heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding: 0 4px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	.section__count {
		font-size: 13px;
		font-weight: 500;
		color: var(--color-text-subtle);
	}

	.action-item {
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 56px;
		padding: 8px 16px;
	}

	.action-item__box {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		border: 1.5px solid var(--color-checkbox);
		border-radius: 6px;
	}

	.action-item__text {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: 8px;
		min-width: 0;
	}

	.action-item__name {
		font-size: 16px;
		font-weight: 600;
	}

	.action-item__conc {
		font-size: 14px;
		color: var(--color-text-muted);
	}
</style>
