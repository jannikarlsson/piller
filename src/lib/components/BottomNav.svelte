<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n/sv';

	const links = [
		{ href: '/inventory', label: t.nav.inventory, icon: '🏠' },
		{ href: '/prescription', label: t.nav.prescription, icon: '📋' },
		{ href: '/actions', label: t.nav.actions, icon: '✨' },
		{ href: '/medications', label: t.nav.medications, icon: '💊' }
	];
</script>

<nav class="bottom-nav">
	{#each links as link}
		<a
			href={link.href}
			class="nav-item"
			class:nav-item--active={$page.url.pathname === link.href}
			aria-label={link.label}
		>
			<span class="nav-item__icon">{link.icon}</span>
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
		background: rgba(26, 5, 51, 0.95);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-top: 2px solid rgba(124, 58, 237, 0.4);
		padding-bottom: env(safe-area-inset-bottom, 0);
		z-index: 100;
	}

	.nav-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 0.25rem;
		text-decoration: none;
		transition: transform 0.15s ease;
		position: relative;
	}

	.nav-item:active {
		transform: scale(0.9);
	}

	.nav-item__icon {
		font-size: 1.5rem;
		line-height: 1;
		opacity: 0.45;
		transition: opacity 0.2s ease, transform 0.2s ease;
	}

	.nav-item__label {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		color: rgba(196, 181, 253, 0.45);
		margin-top: 0.2rem;
		letter-spacing: 0.01em;
		transition: color 0.2s ease;
	}

	.nav-item--active::before {
		content: '';
		position: absolute;
		top: -2px;
		left: 50%;
		transform: translateX(-50%);
		width: 40px;
		height: 3px;
		background: linear-gradient(90deg, #A78BFA, #F4A261);
		border-radius: 0 0 3px 3px;
	}

	.nav-item--active .nav-item__icon {
		opacity: 1;
		transform: scale(1.1);
	}

	.nav-item--active .nav-item__label {
		color: #ffffff;
	}
</style>
