<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { userStore } from '$lib/stores/auth';
	import { medicationsStore } from '$lib/stores/medications';
	import { showToast } from '$lib/stores/toast';
	import { resetAllStates, signOutUser } from '$lib/firebase';
	import Page from '$lib/components/layout/Page.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import ListItem from '$lib/components/ui/ListItem.svelte';
	import BottomSheet from '$lib/components/ui/BottomSheet.svelte';
	import ConfirmDialog from '$lib/components/dialogs/ConfirmDialog.svelte';

	const user = $derived($userStore);

	/** Which confirmation drawer is open, if any. */
	let confirming = $state<'resetAll' | 'logout' | null>(null);

	async function handleResetAll() {
		if (!user) return;
		await resetAllStates(user.uid);
		confirming = null;
		showToast(t.profile.resetAllSuccess);
	}

	async function handleLogout() {
		await signOutUser();
		confirming = null;
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

	<Section title={t.profile.dataHeading}>
		<Card list>
			<ListItem label={t.profile.resetAll} onclick={() => (confirming = 'resetAll')} />
		</Card>
	</Section>

	<Section title={t.profile.accountHeading}>
		<Card list>
			<ListItem label={t.profile.logout} tone="danger" onclick={() => (confirming = 'logout')} />
		</Card>
	</Section>
</Page>

{#if confirming === 'resetAll'}
	<BottomSheet title={t.profile.resetAllTitle} onclose={() => (confirming = null)}>
		<ConfirmDialog
			message={t.profile.resetAllConfirm}
			confirmLabel={t.profile.resetAllConfirmButton}
			tone="danger"
			errorMessage={t.errors.resetFailed}
			onconfirm={handleResetAll}
			oncancel={() => (confirming = null)}
		/>
	</BottomSheet>
{:else if confirming === 'logout'}
	<BottomSheet title={t.profile.logoutTitle} onclose={() => (confirming = null)}>
		<ConfirmDialog
			message={t.profile.logoutConfirm}
			confirmLabel={t.profile.logoutConfirmButton}
			tone="danger"
			errorMessage={t.errors.logoutFailed}
			onconfirm={handleLogout}
			oncancel={() => (confirming = null)}
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

	/* Long addresses are cut off rather than pushing the layout wider */
	.who__email {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
