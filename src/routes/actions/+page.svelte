<script lang="ts">
	import { t } from '$lib/i18n';
	import { medicationsStore, medicationsLoading } from '$lib/stores/medications';
	import { withErrorToast } from '$lib/stores/toast';
	import { settingsStore } from '$lib/stores/settings';
	import { updateStatus } from '$lib/firebase';
	import {
		statusOf,
		isAddedToTodo,
		needsAction,
		type Medication,
		type StatusKind
	} from '$lib/models';
	import Page from '$lib/components/layout/Page.svelte';
	import Checkbox from '$lib/components/inputs/Checkbox.svelte';
	import MedicationInfo from '$lib/components/medication/MedicationInfo.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';

	const medications = $derived($medicationsStore);
	const loading = $derived($medicationsLoading);

	/*
	 * Items ticked during this visit, keyed "kind:id". Ticking resets the status to
	 * neutral right away, but the item stays on screen (struck through) until the page
	 * is left, because this state lives only as long as the page component.
	 */
	let done = $state<string[]>([]);

	const isDone = (kind: StatusKind, med: Medication) =>
		done.includes(`${kind}:${med.id}`) && statusOf(med, kind) !== 'out';

	const SECTIONS = [
		{ kind: 'inventory', heading: 'buyHeading' },
		{ kind: 'prescription', heading: 'prescriptionHeading' }
	] as const;

	const sections = $derived(
		SECTIONS.filter(
			(section) => section.kind !== 'prescription' || $settingsStore.showPrescriptions
		)
			.map((section) => {
				const items = medications.filter(
					(m) => needsAction(m, section.kind) || isDone(section.kind, m)
				);
				const remaining = items.filter((m) => !isDone(section.kind, m)).length;
				return { ...section, items, remaining };
			})
			.filter((section) => section.items.length > 0)
	);
	const allGood = $derived(sections.length === 0);

	// Whether a ticked item had been added by hand, so unticking can restore that.
	// Only read when unticking, never shown, so it doesn't need to be reactive.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const addedByHand = new Map<string, boolean>();

	async function handleToggle(kind: StatusKind, med: Medication, checked: boolean) {
		const key = `${kind}:${med.id}`;
		const previous = done;
		if (checked) addedByHand.set(key, isAddedToTodo(med, kind));
		done = checked ? [...done, key] : done.filter((k) => k !== key);
		const saved = await withErrorToast(() =>
			checked
				? updateStatus(med.id, kind, 'neutral')
				: updateStatus(med.id, kind, 'out', addedByHand.get(key) ?? false)
		);
		if (!saved) done = previous;
	}
</script>

<Page title={t.actions.title} {loading}>
	{#if allGood}
		<EmptyState icon="check" tone="ok" title={t.actions.allGood} message={t.actions.allGoodSub} />
	{:else}
		<div class="sections">
			{#each sections as section (section.kind)}
				<Section title={t.actions[section.heading]} count={section.remaining}>
					<Card list as="ul">
						{#each section.items as med (med.id)}
							{@const ticked = isDone(section.kind, med)}
							<li>
								<Checkbox
									checked={ticked}
									onchange={(checked) => handleToggle(section.kind, med, checked)}
								>
									<MedicationInfo medication={med} layout="inline" done={ticked} />
								</Checkbox>
							</li>
						{/each}
					</Card>
				</Section>
			{/each}
		</div>
	{/if}
</Page>

<style>
	.sections {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}
</style>
