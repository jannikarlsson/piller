<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { userStore } from '$lib/stores/auth';
	import { medicationsStore, medicationsLoading } from '$lib/stores/medications';
	import {
		addMedication,
		updateMedication,
		deleteMedication,
		resetAllStates,
		signOutUser,
		type Medication,
		type MedicationInput
	} from '$lib/firebase';
	import MedicationForm from '$lib/components/forms/MedicationForm.svelte';
	import Page from '$lib/components/layout/Page.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import BottomSheet from '$lib/components/ui/BottomSheet.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import ConfirmDialog from '$lib/components/dialogs/ConfirmDialog.svelte';

	const medications = $derived($medicationsStore);
	const loading = $derived($medicationsLoading);

	type Sheet = { mode: 'add' } | { mode: 'edit'; med: Medication } | null;
	let sheet = $state<Sheet>(null);
	let saving = $state(false);
	/** In the edit sheet: showing the "are you sure?" view instead of the form. */
	let confirmingDelete = $state(false);

	function openSheet(next: Exclude<Sheet, null>) {
		confirmingDelete = false;
		sheet = next;
	}

	function closeSheet() {
		sheet = null;
		confirmingDelete = false;
	}
	let showSettings = $state(false);
	let toastMessage = $state<string | null>(null);

	function showToast(msg: string) {
		toastMessage = msg;
		setTimeout(() => (toastMessage = null), 2500);
	}

	async function handleSave(data: MedicationInput) {
		const user = $userStore;
		if (!user) return;
		saving = true;
		try {
			if (sheet?.mode === 'edit') {
				await updateMedication(user.uid, sheet.med.id, data);
			} else {
				await addMedication(user.uid, data);
			}
			closeSheet();
		} catch {
			showToast(t.errors.saveFailed);
		} finally {
			saving = false;
		}
	}

	/** Called from the confirm view; errors are shown inside the dialog. */
	async function handleDelete(id: string) {
		const user = $userStore;
		if (!user) return;
		await deleteMedication(user.uid, id);
		closeSheet();
	}

	async function handleReset() {
		const user = $userStore;
		if (!user) return;
		if (!confirm(t.settings.resetConfirm)) return;
		try {
			await resetAllStates(user.uid);
			showToast(t.settings.resetSuccess);
			showSettings = false;
		} catch {
			showToast(t.errors.saveFailed);
		}
	}

	async function handleLogout() {
		if (!confirm(t.settings.logoutConfirm)) return;
		await signOutUser();
	}
</script>

<Page title={t.medications.title} subtitle={t.medications.subtitle} {loading} floatingButton>
	{#snippet actions()}
		<Button
			variant="quiet"
			size="icon"
			ariaLabel={t.common.settings}
			expanded={showSettings}
			onclick={() => (showSettings = !showSettings)}
		>
			<Icon name="settings" />
		</Button>
	{/snippet}

	{#if showSettings}
		<Card padding="md">
			<div class="settings-panel">
				<div class="settings-section">
					<p class="text-name">{t.settings.resetTitle}</p>
					<p class="settings-desc text-meta">{t.settings.resetDescription}</p>
					<Button variant="danger-outline" size="sm" onclick={handleReset}>
						{t.settings.resetButton}
					</Button>
				</div>
				<div class="settings-divider"></div>
				<Button variant="secondary" size="sm" onclick={handleLogout}>{t.settings.logoutButton}</Button>
			</div>
		</Card>
	{/if}

	{#if medications.length === 0}
		<EmptyState icon="pill" message={t.medications.empty} />
	{:else}
		<Card variant="accent" list as="ul">
			{#each medications as med (med.id)}
				<li class="med-row">
					<span class="med-row__info">
						<span class="text-name">{med.name}</span>
						{#if med.concentration}
							<span class="text-meta">{med.concentration}</span>
						{/if}
						{#if med.alternativeNames.length > 0}
							<span class="med-row__alt text-caption">{med.alternativeNames.join(', ')}</span>
						{/if}
					</span>
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

{#if toastMessage}
	<Toast message={toastMessage} />
{/if}

<style>
	/* Settings */
	/* Buttons in the panel keep their natural width */
	.settings-panel {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-3);
	}

	.settings-section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-1);
	}

	.settings-desc {
		margin-bottom: var(--space-2);
		line-height: var(--leading-normal);
	}

	.settings-divider {
		align-self: stretch;
		height: 1px;
		background: var(--color-border-light);
	}

	/* List */
	.med-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		min-height: var(--row-height-tall);
		/* Less on the right: the edit button's own tap area supplies the rest */
		padding: var(--row-padding-y) var(--space-1) var(--row-padding-y) var(--row-padding-x);
	}

	.med-row__info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}

	.med-row__alt {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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
