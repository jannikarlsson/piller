<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import { userStore } from '$lib/stores/auth';
	import Icon, { type IconName } from '$lib/components/ui/Icon.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';

	// `icon: null` shows the user's photo instead (the Profil tab).
	// Labels are looked up when shown, so they follow the current language.
	const links: { href: string; label: keyof typeof t.nav; icon: IconName | null }[] = [
		{ href: '/inventory', label: 'inventory', icon: 'cabinet' },
		{ href: '/prescription', label: 'prescription', icon: 'prescription' },
		{ href: '/picking', label: 'picking', icon: 'organizer' },
		{ href: '/actions', label: 'actions', icon: 'checklist' },
		{ href: '/profile', label: 'profile', icon: null }
	];
</script>

<nav class="bottom-nav" aria-label={t.common.mainMenu}>
	{#each links as link}
		<!-- Sub-pages (e.g. /profile/medications) keep their parent tab highlighted -->
		{@const active =
			$page.url.pathname === link.href || $page.url.pathname.startsWith(`${link.href}/`)}
		<a
			href={link.href}
			class="nav-item"
			class:nav-item--active={active}
			aria-current={active ? 'page' : undefined}
		>
			{#if link.icon}
				<Icon name={link.icon} size="lg" />
			{:else}
				<span class="nav-item__avatar"><Avatar photoUrl={$userStore?.photoURL} /></span>
			{/if}
			<span class="nav-item__label">{t.nav[link.label]}</span>
		</a>
	{/each}
</nav>

<style>
	.bottom-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		padding: var(--space-2) var(--space-2) calc(var(--space-2) + env(safe-area-inset-bottom, 0px));
		background: var(--color-surface);
		border-top: 1px solid var(--color-border-light);
		z-index: var(--z-nav);
	}

	.nav-item {
		flex: 1;
		min-height: var(--size-control);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-1);
		text-decoration: none;
		color: var(--color-text-subtle);
		border-radius: var(--radius-control);
		-webkit-tap-highlight-color: transparent;
	}

	.nav-item__label {
		font-size: var(--text-2xs);
		font-weight: 500;
	}

	.nav-item--active {
		color: var(--color-accent);
	}

	.nav-item--active .nav-item__label {
		font-weight: 600;
	}

	/* The photo gets a ring in the active colour instead of changing colour */
	.nav-item__avatar {
		display: flex;
		border-radius: 50%;
		box-shadow: 0 0 0 1.5px transparent;
	}

	.nav-item--active .nav-item__avatar {
		box-shadow: 0 0 0 2px var(--color-accent);
	}
</style>
