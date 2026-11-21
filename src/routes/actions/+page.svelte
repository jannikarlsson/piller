<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { medicationsStore, medicationsLoading } from '$lib/stores/medications';
	import { userStore } from '$lib/stores/auth';
	import { updateTileState, ADDED_TO_TODO_FIELD, type Medication } from '$lib/firebase';
	import Toast from '$lib/components/ui/Toast.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
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
						<span class="section__count">{section.remaining}</span>
					</h2>
					<ListCard as="ul">
						{#each section.items as med (med.id)}
							{@const isTicked = isDone(section.id, med)}
							<li>
								<label class="action-item" class:action-item--ticked={isTicked}>
									<input
										type="checkbox"
										class="action-item__input"
										checked={isTicked}
										onchange={(e) => handleToggle(section.id, med, e.currentTarget.checked)}
									/>
									<span class="action-item__box" aria-hidden="true">
										{#if isTicked}
											<Icon name="check" size={16} strokeWidth={2.5} />
										{/if}
									</span>
									<span class="action-item__text">
										<span class="action-item__name">{med.name}</span>
										{#if med.concentration}
											<span class="action-item__conc">{med.concentration}</span>
										{/if}
									</span>
								</label>
							</li>
						{/each}
					</ListCard>
				</section>
			{/each}
		</div>
	{/if}
</div>

{#if toastMessage}
	<Toast message={toastMessage} />
{/if}

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
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 56px;
		padding: 8px 16px;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition: background-color 0.12s ease;
	}

	.action-item:active {
		background: var(--color-accent-soft);
	}

	/* Native checkbox stays focusable and accessible; the box below is its visual */
	.action-item__input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
	}

	.action-item__box {
		width: 22px;
		height: 22px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1.5px solid var(--color-checkbox);
		border-radius: 6px;
		background: var(--color-surface);
		color: #ffffff;
		transition:
			background-color 0.12s ease,
			border-color 0.12s ease;
	}

	.action-item__input:focus-visible + .action-item__box {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.action-item--ticked .action-item__box {
		background: var(--color-accent);
		border-color: var(--color-accent);
	}

	.action-item--ticked .action-item__name {
		color: var(--color-text-subtle);
		text-decoration: line-through;
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
