<!--
	A drawer that slides up from the bottom, as a modal <dialog>. The browser puts it above
	everything, makes the rest of the page unreachable for keyboard and screen readers while
	it's open, and returns focus to whatever opened it when it closes.
-->
<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { t } from '$lib/i18n';
	import Icon from './Icon.svelte';
	import Button from './Button.svelte';

	interface Props {
		title: string;
		onclose: () => void;
		children: Snippet;
	}

	let { title, onclose, children }: Props = $props();

	const titleId = $props.id();

	const reduceMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const slideIn = { y: '100%', duration: reduceMotion ? 0 : 260, easing: cubicOut, opacity: 1 };
	const slideOut = { y: '100%', duration: reduceMotion ? 0 : 180, opacity: 1 };
	const backdrop = { duration: reduceMotion ? 0 : 200 };

	let dialog: HTMLDialogElement;
	let panel: HTMLDivElement;

	onMount(() => {
		dialog.showModal();
		// Start on the drawer itself (it announces the title), not on the first button,
		// and without opening the keyboard on phones for drawers with text fields
		panel.focus();
	});

	// Escape (or the phone's back gesture): let the parent close it, so the slide-out plays.
	// If the browser insists on closing it right away, it still sends this event first.
	function handleCancel(e: Event) {
		e.preventDefault();
		onclose();
	}

	// After the slide-out: close the dialog, which hands focus back to the opener
	function handleOutroEnd() {
		if (dialog.open) dialog.close();
	}
</script>

<dialog bind:this={dialog} class="sheet-dialog" aria-labelledby={titleId} oncancel={handleCancel}>
	<div
		class="sheet-backdrop"
		onclick={onclose}
		role="presentation"
		transition:fade|global={backdrop}
	></div>
	<div
		bind:this={panel}
		class="sheet"
		tabindex="-1"
		in:fly|global={slideIn}
		out:fly|global={slideOut}
		onoutroend={handleOutroEnd}
	>
		<div class="sheet__handle" aria-hidden="true"></div>
		<div class="sheet__header">
			<h2 class="text-title" id={titleId}>{title}</h2>
			<Button variant="quiet" size="icon" ariaLabel={t.common.close} onclick={onclose}>
				<Icon name="close" />
			</Button>
		</div>
		{@render children()}
	</div>
</dialog>

<style>
	/* A transparent full-screen frame; our own backdrop and panel inside it do the animating */
	.sheet-dialog {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		max-width: none;
		max-height: none;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		overflow: hidden;
	}

	.sheet-dialog::backdrop {
		background: transparent;
	}

	.sheet-backdrop {
		position: fixed;
		inset: 0;
		background: var(--backdrop);
	}

	.sheet {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		max-height: 90dvh;
		overflow-y: auto;
		background: var(--color-surface);
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		padding: var(--space-2) var(--space-5) calc(var(--space-8) + env(safe-area-inset-bottom, 0px));
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}

	/* Focused on open so screen readers start at the title; no outline needed for that */
	.sheet:focus {
		outline: none;
	}

	.sheet__handle {
		width: 36px;
		height: 4px;
		background: var(--color-border);
		border-radius: 2px;
		margin: 0 auto;
		flex-shrink: 0;
	}

	.sheet__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* Lets the close icon line up with the content edge */
		margin-right: calc(-1 * var(--space-3));
	}
</style>
