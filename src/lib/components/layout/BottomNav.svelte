<script lang="ts">
	import { page } from '$app/state';
	import { t } from '#lib/i18n/index.ts';
	import { userStore } from '#lib/stores/auth.ts';
	import { settingsStore } from '#lib/stores/settings.ts';
	import { NAV_LINKS, isLinkVisible, isUnder } from '#lib/navigation.ts';
	import Icon from '#lib/components/ui/Icon.svelte';
	import Avatar from '#lib/components/ui/Avatar.svelte';

	const visibleLinks = $derived(NAV_LINKS.filter((link) => isLinkVisible(link, $settingsStore)));
</script>

<nav class="bottom-nav" aria-label={t.common.mainMenu} data-sveltekit-preload-code="eager">
	{#each visibleLinks as link (link.href)}
		{@const active = isUnder(page.url.pathname, link.href)}
		<a
			href={link.href}
			class="nav-item"
			class:nav-item--active={active}
			aria-current={active ? 'page' : undefined}
		>
			<span class="nav-item__box">
				{#if link.icon}
					<Icon name={link.icon} size="lg" />
				{:else}
					<span class="nav-item__avatar"><Avatar photoUrl={$userStore?.photoURL} /></span>
				{/if}
				<span class="nav-item__label">{t.nav[link.label]}</span>
			</span>
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
		gap: var(--space-1);
		padding: var(--space-1) var(--space-1) calc(var(--space-1) + env(safe-area-inset-bottom, 0px));
		background: var(--color-surface);
		border-top: 1px solid var(--color-border-light);
		z-index: var(--z-nav);
	}

	.nav-item {
		flex: 1;
		display: flex;
		text-decoration: none;
		color: var(--color-text-subtle);
		-webkit-tap-highlight-color: transparent;
	}

	.nav-item__box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		width: 100%;
		min-height: var(--size-control);
		padding: var(--space-2) 0;
		border-radius: var(--radius-control);
		transition:
			background-color var(--transition-fast),
			color var(--transition-fast);
	}

	.nav-item__label {
		font-size: var(--text-2xs);
		font-weight: 500;
	}

	/* The link fills the column; show the focus ring around the visible box instead */
	.nav-item:focus-visible {
		outline: none;
	}

	.nav-item:focus-visible .nav-item__box {
		outline: var(--focus-outline);
		outline-offset: 0;
	}

	.nav-item--active .nav-item__box {
		background: var(--color-accent-tint);
		color: var(--color-accent-hover);
	}

	.nav-item--active .nav-item__label {
		font-weight: 600;
	}

	.nav-item__avatar {
		display: flex;
	}
</style>
