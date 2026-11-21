<!--
	The app's button. Renders a link instead when `href` is given.
	`md` (48px) is for forms and dialogs, `sm` (44px) for inline actions.
	`ghost` has no background or border, for actions in a page header.
	`quiet` + size `icon` is a 44px square icon-only button; give it an `ariaLabel`.
	`danger-outline` and `danger-ghost` are quieter destructive actions than `danger`.
	`floating` adds a shadow for a button that floats over content (position it from the page).
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?:
			| 'primary'
			| 'secondary'
			| 'danger'
			| 'danger-outline'
			| 'danger-ghost'
			| 'ghost'
			| 'quiet';
		size?: 'md' | 'sm' | 'icon';
		type?: 'button' | 'submit';
		href?: string;
		disabled?: boolean;
		ariaLabel?: string;
		/** For buttons that open something: shown highlighted and announced as expanded. */
		expanded?: boolean;
		floating?: boolean;
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
		floating = false,
		onclick,
		children
	}: Props = $props();
</script>

{#if href}
	<a
		class="btn btn--{variant} btn--{size}"
		class:btn--floating={floating}
		{href}
		aria-label={ariaLabel}
	>
		{@render children()}
	</a>
{:else}
	<button
		class="btn btn--{variant} btn--{size}"
		class:btn--expanded={expanded}
		class:btn--floating={floating}
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
		gap: var(--space-2);
		font-weight: 500;
		border-radius: var(--radius-control);
		text-decoration: none;
		transition: background-color var(--transition-fast);
	}

	.btn--md {
		height: var(--size-control);
		padding: 0 var(--space-5);
		font-size: var(--text-md);
	}

	.btn--sm {
		height: var(--size-tap);
		padding: 0 var(--space-4);
		font-size: var(--text-md);
	}

	.btn--icon {
		flex-shrink: 0;
		width: var(--size-tap);
		height: var(--size-tap);
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

	.btn--danger-outline {
		background: var(--color-surface);
		color: var(--color-danger);
		border: 1px solid var(--color-danger-border);
	}

	.btn--danger-outline:not(:disabled):active {
		background: var(--color-danger-bg);
	}

	.btn--danger-ghost {
		background: transparent;
		color: var(--color-danger);
		border: none;
	}

	.btn--danger-ghost:not(:disabled):active {
		background: var(--color-danger-bg);
	}

	.btn--ghost {
		padding: 0 var(--space-3);
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

	.btn--floating {
		box-shadow: var(--shadow-raised);
	}
</style>
