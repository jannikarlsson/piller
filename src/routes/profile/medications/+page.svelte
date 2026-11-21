<script lang="ts">
	import { t } from '#lib/i18n/index.ts';
	import { withErrorToast } from '#lib/stores/toast.ts';
	import { medicationsStore, medicationsLoading } from '#lib/stores/medications.ts';
	import { addMedication, updateMedication, deleteMedication } from '#lib/firebase/index.ts';
	import type { Medication, MedicationInput } from '#lib/models/index.ts';
	import MedicationForm from '#lib/components/dialogs/MedicationForm.svelte';
	import Page from '#lib/components/layout/Page.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import MedicationInfo from '#lib/components/medication/MedicationInfo.svelte';
	import Card from '#lib/components/ui/Card.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import BottomSheet from '#lib/components/ui/BottomSheet.svelte';
	import ConfirmDialog from '#lib/components/dialogs/ConfirmDialog.svelte';

	const medications = $derived($medicationsStore);
	const loading = $derived($medicationsLoading);

	type Sheet = { mode: 'add' } | { mode: 'edit'; med: Medication } | null;
	let sheet = $state<Sheet>(null);
	let saving = $state(false);
	let confirmingDelete = $state(false);

	function openSheet(next: Exclude<Sheet, null>) {
		confirmingDelete = false;
		sheet = next;
	}

	function closeSheet() {
		sheet = null;
		confirmingDelete = false;
	}

	async function handleSave(data: MedicationInput) {
		const editing = sheet?.mode === 'edit' ? sheet.med : null;
		saving = true;
		const saved = await withErrorToast(
			() => (editing ? updateMedication(editing.id, data) : addMedication(data)),
			t.errors.saveFailed
		);
		saving = false;
		if (saved) closeSheet();
	}

	/** Called from the confirm view; errors are shown inside the dialog. */
	async function handleDelete(id: string) {
		await deleteMedication(id);
		closeSheet();
	}
</script>

<Page
	title={t.medications.title}
	back={{ href: '/profile', label: t.nav.profile }}
	{loading}
	floatingButton
>
	{#if medications.length === 0}
		<EmptyState icon="pill" message={t.common.noMedications} />
	{:else}
		<Card list as="ul">
			{#each medications as med (med.id)}
				<li class="med-row">
					<MedicationInfo medication={med} />
					<Button
						variant="quiet"
						size="icon"
						ariaLabel="{t.common.edit} {med.name}"
						onclick={() => openSheet({ mode: 'edit', med })}
					>
						<Icon name="edit" />
					</Button>
				</li>
			{/each}
		</Card>
	{/if}

	<div class="add-btn">
		<Button floating onclick={() => openSheet({ mode: 'add' })}>
			<Icon name="plus" />
			{t.common.add}
		</Button>
	</div>
</Page>

{#if sheet}
	<BottomSheet
		title={confirmingDelete
			? t.medications.deleteTitle
			: sheet.mode === 'add'
				? t.medications.addTitle
				: t.medications.editTitle}
		onclose={closeSheet}
	>
		<!-- The form stays mounted while confirming, so going back keeps any unsaved edits -->
		<div class="sheet-view" hidden={confirmingDelete}>
			<MedicationForm
				initial={sheet.mode === 'edit' ? sheet.med : {}}
				onSave={handleSave}
				onCancel={closeSheet}
				{saving}
			/>
			{#if sheet.mode === 'edit'}
				<div class="delete-row">
					<Button variant="danger-ghost" size="sm" onclick={() => (confirmingDelete = true)}>
						{t.medications.deleteButton}
					</Button>
				</div>
			{/if}
		</div>

		{#if confirmingDelete && sheet.mode === 'edit'}
			{@const med = sheet.med}
			<ConfirmDialog
				message={t.medications.deleteConfirm(med.name)}
				confirmLabel={t.medications.deleteConfirmButton}
				tone="danger"
				errorMessage={t.errors.deleteFailed}
				onconfirm={() => handleDelete(med.id)}
				oncancel={() => (confirmingDelete = false)}
			/>
		{/if}
	</BottomSheet>
{/if}

<style>
	.med-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		min-height: var(--row-height-tall);
		/* Less on the right: the edit button's own tap area supplies the rest */
		padding: var(--row-padding-y) var(--space-1) var(--row-padding-y) var(--row-padding-x);
	}

	.add-btn {
		position: fixed;
		right: var(--space-4);
		bottom: calc(var(--nav-height) + var(--space-5) + env(safe-area-inset-bottom, 0px));
		z-index: var(--z-floating);
	}

	.sheet-view {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}

	.sheet-view[hidden] {
		display: none;
	}

	.delete-row {
		display: flex;
		justify-content: center;
	}
</style>
