<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { medicationsStore, medicationsLoading } from '$lib/stores/medications';
	import { userStore } from '$lib/stores/auth';
	import { updateTileState, ADDED_TO_TODO_FIELD, type Medication } from '$lib/firebase';
	import Toast from '$lib/components/ui/Toast.svelte';
	import Page from '$lib/components/layout/Page.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import ListCard from '$lib/components/ui/ListCard.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	type SectionId = 'buy' | 'rx';

	const FIELD = { buy: 'inventoryState', rx: 'prescriptionState' } as const;
	const TOAST_MS = 4000;

	const medications = $derived($medicationsStore);
	const loading = $derived($medicationsLoading);

	/*
	 * Items ticked during this visit, keyed "section:id". Ticking resets the status to
	 * neutral right away, but the item stays on screen (struck through) until the page
	 * is left, because this state lives only as long as the page component.
	 */
	let done = $state<string[]>([]);

	const isDone = (section: SectionId, med: Medication) =>
		done.includes(`${section}:${med.id}`) && med[FIELD[section]] !== 'out';

	// On the list when out and either reminded automatically or added by hand
	const needsBuy = $derived(
		medications.filter(
			(m) =>
				isDone('buy', m) || (m.inventoryState === 'out' && (m.remindToBuy || m.addedToBuyList))
		)
	);
	const needsPrescription = $derived(
		medications.filter(
			(m) =>
				isDone('rx', m) ||
				(m.prescriptionState === 'out' && (m.remindPrescription || m.addedToPrescriptionList))
		)
	);

	// Whether a ticked item had been added by hand, so unticking can restore that
	const addedByHand = new Map<string, boolean>();
	const allGood = $derived(needsBuy.length === 0 && needsPrescription.length === 0);

	const sections = $derived(
		(
			[
				{ id: 'buy', heading: t.actions.buyHeading, items: needsBuy },
				{ id: 'rx', heading: t.actions.prescriptionHeading, items: needsPrescription }
			] as const
		)
			.filter((s) => s.items.length > 0)
			.map((s) => ({ ...s, remaining: s.items.filter((m) => !isDone(s.id, m)).length }))
	);

	let toastMessage = $state<string | null>(null);
	let toastTimer: ReturnType<typeof setTimeout> | undefined;

	function showError() {
		clearTimeout(toastTimer);
		toastMessage = t.errors.updateFailed;
		toastTimer = setTimeout(() => (toastMessage = null), TOAST_MS);
	}

	/** Tick: reset the status to neutral. Untick: set it back to out. */
	async function handleToggle(section: SectionId, med: Medication, checked: boolean) {
		const user = $userStore;
		if (!user) return;
		const key = `${section}:${med.id}`;
		const field = FIELD[section];
		const previous = done;
		if (checked) addedByHand.set(key, med[ADDED_TO_TODO_FIELD[field]]);
		done = checked ? [...done, key] : done.filter((k) => k !== key);
		try {
			if (checked) {
				await updateTileState(user.uid, med.id, field, 'neutral');
			} else {
				await updateTileState(user.uid, med.id, field, 'out', addedByHand.get(key) ?? false);
			}
		} catch {
			done = previous;
			showError();
		}
	}
</script>

<Page title={t.actions.title} subtitle={t.actions.subtitle} {loading}>
	{#if allGood}
		<div class="all-good">
			<span class="all-good__icon"><Icon name="check" size={28} strokeWidth={2.25} /></span>
			<p class="text-title">{t.actions.allGood}</p>
			<p class="all-good__sub text-meta">{t.actions.allGoodSub}</p>
		</div>
	{:else}
		<div class="sections">
			{#each sections as section (section.id)}
				<section class="section" aria-labelledby="heading-{section.id}">
					<h2 class="section__heading text-label" id="heading-{section.id}">
						{section.heading}
						<span class="text-caption">{section.remaining}</span>
					</h2>
					<ListCard as="ul">
						{#each section.items as med (med.id)}
							{@const ticked = isDone(section.id, med)}
							<li>
								<Checkbox
									checked={ticked}
									onchange={(checked) => handleToggle(section.id, med, checked)}
								>
									<span class="item" class:item--done={ticked}>
										<span class="item__name text-name">{med.name}</span>
										{#if med.concentration}
											<span class="text-meta">{med.concentration}</span>
										{/if}
									</span>
								</Checkbox>
							</li>
						{/each}
					</ListCard>
				</section>
			{/each}
		</div>
	{/if}
</Page>

{#if toastMessage}
	<Toast message={toastMessage} />
{/if}

<style>
	.all-good {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
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


	.all-good__sub {
		line-height: var(--leading-normal);
	}

	.sections {
		display: flex;
		flex-direction: column;
		gap: 24px;
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
	}


	.item {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: 8px;
	}



	.item--done .item__name {
		color: var(--color-text-subtle);
		text-decoration: line-through;
	}
</style>
