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
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import ListCard from '$lib/components/ui/ListCard.svelte';
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

<div class="page">
	<PageHeader title={t.medications.title} subtitle={t.medications.subtitle}>
		{#snippet actions()}
			<button
				type="button"
				class="icon-btn"
				class:icon-btn--active={showSettings}
				onclick={() => (showSettings = !showSettings)}
				aria-label={t.common.settings}
				aria-expanded={showSettings}
			>
				<Icon name="settings" size={22} />
			</button>
		{/snippet}
	</PageHeader>

	{#if showSettings}
		<div class="settings-panel">
			<div class="settings-section">
				<p class="settings-label">{t.settings.resetTitle}</p>
				<p class="settings-desc">{t.settings.resetDescription}</p>
				<button type="button" class="small-btn small-btn--danger" onclick={handleReset}>
					{t.settings.resetButton}
				</button>
			</div>
			<div class="settings-divider"></div>
			<button type="button" class="small-btn" onclick={handleLogout}>{t.settings.logoutButton}</button>
		</div>
	{/if}

	{#if loading}
		<p class="status-text">{t.common.loading}</p>
	{:else if medications.length === 0}
		<div class="empty">
			<span class="empty__icon"><Icon name="pill" size={32} /></span>
			<p>{t.medications.empty}</p>
		</div>
	{:else}
		<div class="content">
			<ListCard as="ul">
				{#each medications as med (med.id)}
					<li class="med-row">
						<span class="med-row__info">
							<span class="med-row__name">{med.name}</span>
							{#if med.concentration}
								<span class="med-row__conc">{med.concentration}</span>
							{/if}
							{#if med.alternativeNames.length > 0}
								<span class="med-row__alt">{med.alternativeNames.join(', ')}</span>
							{/if}
						</span>
						<button
							type="button"
							class="icon-btn"
							onclick={() => openSheet({ mode: 'edit', med })}
							aria-label="{t.common.edit} {med.name}"
						>
							<Icon name="edit" size={20} />
						</button>
					</li>
				{/each}
			</ListCard>
		</div>
	{/if}

	<button type="button" class="add-btn" onclick={() => openSheet({ mode: 'add' })}>
		<Icon name="plus" size={20} strokeWidth={2} />
		{t.common.add}
	</button>
</div>

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
				<button type="button" class="delete-btn" onclick={() => (confirmingDelete = true)}>
					{t.medications.deleteButton}
				</button>
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
	.page {
		flex: 1;
		overflow-y: auto;
		padding-bottom: calc(var(--nav-height) + 80px + env(safe-area-inset-bottom, 0px));
	}

	.content {
		padding: 0 16px;
	}

	.icon-btn {
		flex-shrink: 0;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-radius: var(--radius-control);
		color: var(--color-text-muted);
	}

	.icon-btn:active,
	.icon-btn--active {
		background: var(--color-accent-soft);
		color: var(--color-accent);
	}

	/* Settings */
	.settings-panel {
		margin: 0 16px 16px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		background: var(--color-surface);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-card);
	}

	.settings-section {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.settings-label {
		font-size: 16px;
		font-weight: 600;
	}

	.settings-desc {
		margin-bottom: 8px;
		font-size: 14px;
		line-height: 1.4;
		color: var(--color-text-muted);
	}

	.settings-divider {
		height: 1px;
		background: var(--color-border-light);
	}

	.small-btn {
		width: fit-content;
		height: 40px;
		padding: 0 14px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-control);
		font-size: 14px;
		font-weight: 500;
		color: var(--color-text);
	}

	.small-btn--danger {
		border-color: var(--color-danger-border);
		color: var(--color-danger);
	}

	/* List */
	.status-text {
		padding: 48px 20px;
		text-align: center;
		color: var(--color-text-muted);
	}

	.med-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		min-height: 68px;
		padding: 10px 6px 10px 16px;
	}

	.med-row__info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.med-row__name {
		font-size: 16px;
		font-weight: 600;
	}

	.med-row__conc {
		font-size: 14px;
		color: var(--color-text-muted);
	}

	.med-row__alt {
		font-size: 13px;
		color: var(--color-text-subtle);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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

	.add-btn {
		position: fixed;
		right: 16px;
		bottom: calc(var(--nav-height) + 20px + env(safe-area-inset-bottom, 0px));
		height: 48px;
		padding: 0 18px 0 14px;
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--color-accent);
		color: #ffffff;
		border: none;
		border-radius: var(--radius-card);
		font-size: 15px;
		font-weight: 500;
		box-shadow: var(--shadow-raised);
		z-index: 50;
	}

	.add-btn:active {
		background: var(--color-accent-hover);
	}

	.sheet-view {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.sheet-view[hidden] {
		display: none;
	}

	.delete-btn {
		align-self: center;
		height: 44px;
		padding: 0 16px;
		background: transparent;
		border: none;
		font-size: 15px;
		font-weight: 500;
		color: var(--color-danger);
	}
</style>
