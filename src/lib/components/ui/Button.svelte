<!--
	The app's button. Renders a link instead when `href` is given.
	`md` (48px) is for forms and dialogs, `sm` (44px) for inline actions.
	`ghost` has no background or border, for actions in a page header.
	`quiet` + size `icon` is a 44px square icon-only button; give it an `ariaLabel`.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'quiet';
		size?: 'md' | 'sm' | 'icon';
		type?: 'button' | 'submit';
		href?: string;
		disabled?: boolean;
		/** Accessible name, when the visible text alone is not descriptive enough. */
		ariaLabel?: string;
		/** For buttons that open something: shown highlighted and announced as expanded. */
		expanded?: boolean;
		onclick?: () => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		href,
		disabled = false,
		ariaLabel,
		expanded,
		onclick,
		children
	}: Props = $props();
</script>

{#if href}
	<a class="btn btn--{variant} btn--{size}" {href} aria-label={ariaLabel}>{@render children()}</a>
{:else}
	<button
		class="btn btn--{variant} btn--{size}"
		class:btn--expanded={expanded}
		{type}
		{disabled}
		{onclick}
		aria-label={ariaLabel}
		aria-expanded={expanded}
	>
		{@render children()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-weight: 500;
		border-radius: var(--radius-control);
		text-decoration: none;
		transition: background-color 0.12s ease;
	}

	.btn--md {
		height: 48px;
		padding: 0 20px;
		font-size: 16px;
	}

	.btn--sm {
		height: 44px;
		padding: 0 18px;
		font-size: 15px;
	}

	.btn--icon {
		flex-shrink: 0;
		width: 44px;
		height: 44px;
		padding: 0;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn--primary {
		background: var(--color-accent);
		color: var(--color-on-accent);
		border: none;
	}

	.btn--primary:not(:disabled):active {
		background: var(--color-accent-hover);
	}

	.btn--secondary {
		background: var(--color-surface);
		color: var(--color-text);
		border: 1px solid var(--color-border);
	}

	.btn--secondary:not(:disabled):active {
		background: var(--color-bg);
	}

	.btn--danger {
		background: var(--color-danger);
		color: var(--color-on-accent);
		border: none;
	}

	.btn--ghost {
		padding: 0 12px;
		gap: 6px;
		background: transparent;
		color: var(--color-accent);
		border: none;
	}

	.btn--ghost:not(:disabled):active {
		background: var(--color-accent-soft);
	}

	.btn--ghost:disabled {
		color: var(--color-text-subtle);
	}

	.btn--quiet {
		background: transparent;
		color: var(--color-text-muted);
		border: none;
	}

	.btn--quiet:not(:disabled):active,
	.btn--quiet.btn--expanded {
		background: var(--color-accent-soft);
		color: var(--color-accent);
	}
</style>
