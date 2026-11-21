<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { userStore } from '$lib/stores/auth';
	import { medicationsStore, medicationsLoading } from '$lib/stores/medications';
	import { setPicked, resetPicked } from '$lib/firebase';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import ListCard from '$lib/components/ui/ListCard.svelte';
	import ResetButton from '$lib/components/ui/ResetButton.svelte';
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

<div class="page">
	<PageHeader title={t.picking.title} subtitle={t.picking.subtitle}>
		{#snippet actions()}
			{#if medications.length > 0}
				<ResetButton
					label={t.picking.resetButton}
					ariaLabel={t.picking.resetLabel}
					disabled={pickedCount === 0}
					onclick={handleReset}
				/>
			{/if}
		{/snippet}
	</PageHeader>

	{#if loading}
		<p class="status-text">{t.common.loading}</p>
	{:else if medications.length === 0}
		<div class="empty">
			<span class="empty__icon"><Icon name="organizer" size={32} /></span>
			{#if $medicationsStore.length === 0}
				<p>{t.picking.empty}</p>
				<a class="empty__action" href="/medications">{t.picking.emptyAction}</a>
			{:else}
				<p>{t.picking.emptyNoneInOrganizer}</p>
				<a class="empty__action" href="/medications">{t.picking.emptyNoneInOrganizerAction}</a>
			{/if}
		</div>
	{:else}
		<div class="content">
			<p class="progress" class:progress--done={allPicked} aria-live="polite">
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
						<label class="pick-row" class:pick-row--picked={med.picked}>
							<input
								type="checkbox"
								class="pick-row__input"
								checked={med.picked}
								onchange={(e) => toggle(med.id, e.currentTarget.checked)}
							/>
							<span class="pick-row__box" aria-hidden="true">
								{#if med.picked}
									<Icon name="check" size={16} strokeWidth={2.5} />
								{/if}
							</span>
							<span class="pick-row__text">
								<span class="pick-row__name">{med.name}</span>
								{#if med.concentration}
									<span class="pick-row__conc">{med.concentration}</span>
								{/if}
							</span>
						</label>
					</li>
				{/each}
			</ListCard>
		</div>
	{/if}
</div>

<style>
	.page {
		flex: 1;
		overflow-y: auto;
		padding-bottom: calc(var(--nav-height) + 16px + env(safe-area-inset-bottom, 0px));
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 0 16px;
	}

	.progress {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 0 4px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	.progress--done {
		color: var(--color-ok);
	}

	.pick-row {
		position: relative;
		display: flex;
		align-items: center;
		gap: 14px;
		min-height: 60px;
		padding: 10px 16px;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition: background-color 0.12s ease;
	}

	.pick-row:active {
		background: var(--color-accent-soft);
	}

	/* Native checkbox stays focusable and accessible; the box below is its visual */
	.pick-row__input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
	}

	.pick-row__box {
		width: 24px;
		height: 24px;
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

	.pick-row__input:focus-visible + .pick-row__box {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.pick-row--picked .pick-row__box {
		background: var(--color-accent);
		border-color: var(--color-accent);
	}

	.pick-row__text {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: 8px;
		min-width: 0;
	}

	.pick-row__name {
		font-size: 16px;
		font-weight: 600;
	}

	.pick-row__conc {
		font-size: 14px;
		color: var(--color-text-muted);
	}

	.pick-row--picked .pick-row__name {
		color: var(--color-text-subtle);
		text-decoration: line-through;
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
