<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n/sv';
	import Icon, { type IconName } from './Icon.svelte';

	const links: { href: string; label: string; icon: IconName }[] = [
		{ href: '/inventory', label: t.nav.inventory, icon: 'cabinet' },
		{ href: '/prescription', label: t.nav.prescription, icon: 'prescription' },
		{ href: '/picking', label: t.nav.picking, icon: 'organizer' },
		{ href: '/actions', label: t.nav.actions, icon: 'checklist' },
		{ href: '/medications', label: t.nav.medications, icon: 'pill' }
	];
</script>

<nav class="bottom-nav" aria-label={t.common.mainMenu}>
	{#each links as link}
		{@const active = $page.url.pathname === link.href}
		<a
			href={link.href}
			class="nav-item"
			class:nav-item--active={active}
			aria-current={active ? 'page' : undefined}
		>
			<Icon name={link.icon} />
			<span class="nav-item__label">{link.label}</span>
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
		padding: 6px 8px calc(6px + env(safe-area-inset-bottom, 0px));
		background: var(--color-surface);
		border-top: 1px solid var(--color-border-light);
		z-index: 100;
	}

	.nav-item {
		flex: 1;
		min-height: 48px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3px;
		text-decoration: none;
		color: var(--color-text-subtle);
		border-radius: var(--radius-control);
		-webkit-tap-highlight-color: transparent;
	}

	.nav-item__label {
		font-size: 11px;
		font-weight: 500;
	}

	.nav-item--active {
		color: var(--color-accent);
	}

	.nav-item--active .nav-item__label {
		font-weight: 600;
	}
</style>
