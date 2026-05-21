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
	import MedicationForm from '$lib/components/MedicationForm.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	const medications = $derived($medicationsStore);
	const loading = $derived($medicationsLoading);

	type Sheet = { mode: 'add' } | { mode: 'edit'; med: Medication } | null;
	let sheet = $state<Sheet>(null);
	let saving = $state(false);
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
			sheet = null;
		} catch {
			showToast(t.errors.saveFailed);
		} finally {
			saving = false;
		}
	}

	async function handleDelete(id: string) {
		const user = $userStore;
		if (!user) return;
		if (!confirm(t.medications.deleteConfirm)) return;
		try {
			await deleteMedication(user.uid, id);
			sheet = null;
		} catch {
			showToast(t.errors.deleteFailed);
		}
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
	<div class="page-header-row">
		<PageHeader title={t.medications.title} subtitle={t.medications.subtitle} />
		<button class="settings-btn" onclick={() => (showSettings = !showSettings)} aria-label="Inställningar">
			⚙️
		</button>
	</div>

	{#if showSettings}
		<div class="settings-panel">
			<div class="settings-section">
				<p class="settings-label">{t.settings.resetTitle}</p>
				<p class="settings-desc">{t.settings.resetDescription}</p>
				<button class="danger-btn" onclick={handleReset}>{t.settings.resetButton}</button>
			</div>
			<div class="settings-divider"></div>
			<button class="logout-btn" onclick={handleLogout}>{t.settings.logoutButton}</button>
		</div>
	{/if}

	{#if loading}
		<div class="loading">💊 💊 💊</div>
	{:else}
		<div class="med-list">
			{#each medications as med (med.id)}
				<div class="med-row">
					<div class="med-row__info">
						<span class="med-row__name">{med.name}</span>
						{#if med.concentration}
							<span class="med-row__conc">{med.concentration}</span>
						{/if}
						{#if med.alternativeNames.length > 0}
							<span class="med-row__alt">{med.alternativeNames.join(', ')}</span>
						{/if}
					</div>
					<button
						class="edit-btn"
						onclick={() => (sheet = { mode: 'edit', med })}
						aria-label="Redigera {med.name}"
					>
						✏️
					</button>
				</div>
			{/each}
		</div>

		{#if medications.length === 0}
			<div class="empty">
				<div class="empty__icon">💊</div>
				<p>{t.medications.empty}</p>
			</div>
		{/if}
	{/if}

	<button class="fab" onclick={() => (sheet = { mode: 'add' })} aria-label={t.medications.addButton}>
		＋
	</button>
</div>

{#if sheet}
	<div class="sheet-backdrop" onclick={() => (sheet = null)} role="presentation"></div>
	<div class="sheet">
		<div class="sheet__handle"></div>
		<h2 class="sheet__title">
			{sheet.mode === 'add' ? t.medications.addTitle : t.medications.editTitle}
		</h2>
		<MedicationForm
			initial={sheet.mode === 'edit' ? sheet.med : {}}
			onSave={handleSave}
			onCancel={() => (sheet = null)}
			{saving}
		/>
		{#if sheet.mode === 'edit'}
			<button class="delete-btn" onclick={() => sheet?.mode === 'edit' && handleDelete(sheet.med.id)}>
				{t.medications.deleteButton}
			</button>
		{/if}
	</div>
{/if}

{#if toastMessage}
	<div class="toast">{toastMessage}</div>
{/if}

<style>
	.page {
		flex: 1;
		overflow-y: auto;
		padding-bottom: calc(70px + env(safe-area-inset-bottom, 0px));
		position: relative;
	}

	.page-header-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding-right: 1.25rem;
	}

	.settings-btn {
		background: none;
		border: none;
		font-size: 1.4rem;
		cursor: pointer;
		padding: 1.5rem 0 0.5rem;
		-webkit-tap-highlight-color: transparent;
	}

	.settings-panel {
		margin: 0 1.25rem 1rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(124, 58, 237, 0.3);
		border-radius: 1.25rem;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.settings-section {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.settings-label {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 1rem;
		color: #f3f0ff;
	}

	.settings-desc {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.78rem;
		color: rgba(196, 181, 253, 0.6);
		line-height: 1.4;
	}

	.settings-divider {
		height: 1px;
		background: rgba(124, 58, 237, 0.2);
	}

	.danger-btn {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.9rem;
		padding: 0.5rem 1.25rem;
		background: rgba(251, 113, 133, 0.15);
		border: 1px solid #fb7185;
		border-radius: 2rem;
		color: #fda4af;
		cursor: pointer;
		width: fit-content;
	}

	.logout-btn {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.9rem;
		padding: 0.5rem 1.25rem;
		background: transparent;
		border: 1px solid rgba(196, 181, 253, 0.3);
		border-radius: 2rem;
		color: rgba(196, 181, 253, 0.6);
		cursor: pointer;
		width: fit-content;
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

	.med-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
	}

	.med-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 1rem 1.1rem;
		background: #231848;
		border-radius: 1rem;
	}

	.med-row__info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}

	.med-row__name {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 1.1rem;
		font-weight: 700;
		color: #ffffff;
	}

	.med-row__conc {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.82rem;
		font-weight: 500;
		color: rgba(196, 181, 253, 0.65);
	}

	.med-row__alt {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.75rem;
		color: rgba(196, 181, 253, 0.35);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.edit-btn {
		background: none;
		border: none;
		font-size: 1.1rem;
		cursor: pointer;
		flex-shrink: 0;
		padding: 0.25rem;
		-webkit-tap-highlight-color: transparent;
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 3rem 2rem;
		text-align: center;
	}

	.empty__icon {
		font-size: 3rem;
		opacity: 0.4;
	}

	.empty p {
		font-family: 'Bricolage Grotesque', sans-serif;
		color: rgba(196, 181, 253, 0.5);
	}

	.fab {
		position: fixed;
		bottom: calc(70px + env(safe-area-inset-bottom, 0px) + 1rem);
		right: 1.25rem;
		width: 56px;
		height: 56px;
		background: #7C3AED;
		color: white;
		border: none;
		border-radius: 50%;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.15s ease;
		z-index: 50;
	}

	.fab:active {
		transform: scale(0.9);
	}

	/* Bottom sheet */
	.sheet-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 200;
		backdrop-filter: blur(4px);
	}

	.sheet {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 201;
		background: #150D2E;
		border-top: 1px solid rgba(167, 139, 250, 0.2);
		border-radius: 1.5rem 1.5rem 0 0;
		padding: 0.75rem 1.5rem calc(2rem + env(safe-area-inset-bottom, 0px));
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.sheet__handle {
		width: 36px;
		height: 4px;
		background: rgba(167, 139, 250, 0.25);
		border-radius: 2px;
		margin: 0 auto 0.25rem;
	}

	.sheet__title {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 1.4rem;
		font-weight: 800;
		color: #ffffff;
		letter-spacing: -0.02em;
	}

	.delete-btn {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.9rem;
		padding: 0.6rem;
		background: transparent;
		border: 1px solid rgba(251, 113, 133, 0.3);
		border-radius: 2rem;
		color: #fda4af;
		cursor: pointer;
		text-align: center;
	}

	/* Toast */
	.toast {
		position: fixed;
		bottom: calc(80px + env(safe-area-inset-bottom, 0px));
		left: 50%;
		transform: translateX(-50%);
		background: rgba(26, 5, 51, 0.95);
		border: 1px solid rgba(124, 58, 237, 0.5);
		color: #f3f0ff;
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.85rem;
		font-weight: 700;
		padding: 0.6rem 1.25rem;
		border-radius: 2rem;
		z-index: 300;
		white-space: nowrap;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
	}
</style>
