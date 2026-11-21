<script lang="ts">
	import { t, LANGUAGE_NAMES, type LanguageSetting } from '$lib/i18n';
	import { userStore } from '$lib/stores/auth';
	import { medicationsStore } from '$lib/stores/medications';
	import { showToast, withErrorToast } from '$lib/stores/toast';
	import { settingsStore, updateSettings } from '$lib/stores/settings';
	import { resetAllStates, signOutUser } from '$lib/firebase';
	import type { ThemeSetting, UserSettings } from '$lib/models';
	import Page from '$lib/components/layout/Page.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import ListItem from '$lib/components/ui/ListItem.svelte';
	import SwitchItem from '$lib/components/ui/SwitchItem.svelte';
	import BottomSheet from '$lib/components/ui/BottomSheet.svelte';
	import ConfirmDialog from '$lib/components/dialogs/ConfirmDialog.svelte';
	import ChoiceDialog from '$lib/components/dialogs/ChoiceDialog.svelte';

	const user = $derived($userStore);

	let openDrawer = $state<'theme' | 'language' | 'resetAll' | 'logout' | null>(null);

	const themeOptions = $derived([
		{ value: 'light' as const, label: t.profile.themeOptions.light },
		{ value: 'dark' as const, label: t.profile.themeOptions.dark },
		{
			value: 'system' as const,
			label: t.profile.themeOptions.system,
			description: t.profile.themeSystemDescription
		}
	]);

	const languageOptions = $derived([
		{ value: 'sv' as const, label: LANGUAGE_NAMES.sv },
		{ value: 'en' as const, label: LANGUAGE_NAMES.en },
		{
			value: 'system' as const,
			label: t.profile.languageSystem,
			description: t.profile.languageSystemDescription
		}
	]);

	const languageLabel = $derived(
		$settingsStore.language === 'system'
			? t.profile.languageSystem
			: LANGUAGE_NAMES[$settingsStore.language]
	);

	function handleLanguage(language: LanguageSetting) {
		openDrawer = null;
		setSetting({ language });
	}

	function setSetting(changes: Partial<UserSettings>) {
		withErrorToast(() => updateSettings(changes), t.errors.settingsFailed);
	}

	function handleTheme(theme: ThemeSetting) {
		openDrawer = null;
		setSetting({ theme });
	}

	async function handleResetAll() {
		if (!user) return;
		await resetAllStates(user.uid);
		openDrawer = null;
		showToast(t.profile.resetAllSuccess);
	}

	async function handleLogout() {
		await signOutUser();
		openDrawer = null;
	}
</script>

<Page title={t.profile.title}>
	{#if user}
		<Card padding="md">
			<div class="who">
				<Avatar photoUrl={user.photoURL} size="lg" />
				<div class="who__text">
					{#if user.displayName}
						<p class="text-name">{user.displayName}</p>
					{/if}
					<p class="who__email text-meta">{user.email}</p>
				</div>
			</div>
		</Card>
	{/if}

	<Card list>
		<ListItem
			label={t.profile.medications}
			value={String($medicationsStore.length)}
			href="/profile/medications"
		/>
	</Card>

	<Section title={t.profile.appearanceHeading}>
		<Card list>
			<ListItem
				label={t.profile.theme}
				value={t.profile.themeOptions[$settingsStore.theme]}
				onclick={() => (openDrawer = 'theme')}
			/>
			<ListItem
				label={t.profile.language}
				value={languageLabel}
				onclick={() => (openDrawer = 'language')}
			/>
		</Card>
	</Section>

	<Section title={t.profile.featuresHeading}>
		<Card list>
			<SwitchItem
				label={t.profile.featurePrescriptions}
				description={t.profile.featurePrescriptionsDescription}
				checked={$settingsStore.showPrescriptions}
				onchange={(on) => setSetting({ showPrescriptions: on })}
			/>
			<SwitchItem
				label={t.profile.featurePillOrganizer}
				description={t.profile.featurePillOrganizerDescription}
				checked={$settingsStore.showPillOrganizer}
				onchange={(on) => setSetting({ showPillOrganizer: on })}
			/>
		</Card>
	</Section>

	<Section title={t.profile.dataHeading}>
		<Card list>
			<ListItem label={t.profile.resetAll} onclick={() => (openDrawer = 'resetAll')} />
		</Card>
	</Section>

	<Section title={t.profile.accountHeading}>
		<Card list>
			<ListItem label={t.profile.logout} tone="danger" onclick={() => (openDrawer = 'logout')} />
		</Card>
	</Section>
</Page>

{#if openDrawer === 'theme'}
	<BottomSheet title={t.profile.theme} onclose={() => (openDrawer = null)}>
		<ChoiceDialog
			legend={t.profile.theme}
			options={themeOptions}
			selected={$settingsStore.theme}
			onselect={handleTheme}
		/>
	</BottomSheet>
{:else if openDrawer === 'language'}
	<BottomSheet title={t.profile.language} onclose={() => (openDrawer = null)}>
		<ChoiceDialog
			legend={t.profile.language}
			options={languageOptions}
			selected={$settingsStore.language}
			onselect={handleLanguage}
		/>
	</BottomSheet>
{:else if openDrawer === 'resetAll'}
	<BottomSheet title={t.profile.resetAllTitle} onclose={() => (openDrawer = null)}>
		<ConfirmDialog
			message={t.profile.resetAllConfirm}
			confirmLabel={t.profile.resetAllConfirmButton}
			tone="danger"
			errorMessage={t.errors.resetFailed}
			onconfirm={handleResetAll}
			oncancel={() => (openDrawer = null)}
		/>
	</BottomSheet>
{:else if openDrawer === 'logout'}
	<BottomSheet title={t.profile.logoutTitle} onclose={() => (openDrawer = null)}>
		<ConfirmDialog
			message={t.profile.logoutConfirm}
			confirmLabel={t.profile.logoutConfirmButton}
			tone="danger"
			errorMessage={t.errors.logoutFailed}
			onconfirm={handleLogout}
			oncancel={() => (openDrawer = null)}
		/>
	</BottomSheet>
{/if}

<style>
	.who {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.who__text {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 0;
	}

	.who__email {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
