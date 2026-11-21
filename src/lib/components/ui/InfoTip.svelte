<!--
	A small circled "i" that shows a short explanation in a bubble: on hover with a mouse,
	or on tap. Tapping elsewhere, Escape or scrolling closes it.
	The bubble is a popover, so it sits above everything and isn't clipped by rounded cards.
-->
<script lang="ts">
	import { t } from '$lib/i18n';
	import Icon from './Icon.svelte';

	interface Props {
		text: string;
		/** Id for the text, so a nearby control can use it as its description (aria-describedby). */
		id?: string;
	}

	const generatedId = $props.id();
	let { text, id = generatedId }: Props = $props();
	let button: HTMLButtonElement;
	let bubble: HTMLElement;
	// Opened by hovering: closes again when the mouse leaves, unless clicked to keep it open
	let openedByHover = false;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	const GAP = 6;
	const EDGE = 8;
	// Time to move the mouse from the icon onto the bubble without it closing (WCAG 1.4.13)
	const CLOSE_DELAY = 300;

	function isOpen() {
		return bubble.matches(':popover-open');
	}

	// Below the icon, or above it when there's no room, and kept inside the screen sideways
	function place() {
		const icon = button.getBoundingClientRect();
		const width = bubble.offsetWidth;
		const height = bubble.offsetHeight;
		const left = Math.min(
			Math.max(icon.left + icon.width / 2 - width / 2, EDGE),
			window.innerWidth - width - EDGE
		);
		const below = icon.bottom + GAP;
		const top = below + height > window.innerHeight - EDGE ? icon.top - GAP - height : below;
		bubble.style.left = `${left}px`;
		bubble.style.top = `${top}px`;
	}

	function handleToggle(e: ToggleEvent) {
		if (e.newState === 'open') place();
		else {
			openedByHover = false;
			clearTimeout(closeTimer);
		}
	}

	// Hovering the icon or the bubble keeps it open; leaving both closes it after a moment
	function handlePointerEnter(e: PointerEvent) {
		if (e.pointerType !== 'mouse') return;
		clearTimeout(closeTimer);
		if (isOpen()) return;
		openedByHover = true;
		bubble.showPopover();
	}

	function handlePointerLeave(e: PointerEvent) {
		if (e.pointerType !== 'mouse' || !openedByHover) return;
		clearTimeout(closeTimer);
		closeTimer = setTimeout(() => {
			if (openedByHover && isOpen()) bubble.hidePopover();
		}, CLOSE_DELAY);
	}

	function handleClick(e: MouseEvent) {
		// Already showing from hover: keep it open instead of toggling it closed
		if (openedByHover) {
			e.preventDefault();
			openedByHover = false;
			clearTimeout(closeTimer);
		}
	}

	// It's fixed to the screen, so it would drift away from the icon when the page scrolls
	function handleScroll() {
		if (bubble && isOpen()) bubble.hidePopover();
	}
</script>

<svelte:window onscrollcapture={handleScroll} onresize={handleScroll} />

<button
	bind:this={button}
	type="button"
	class="info"
	aria-label={t.common.moreInfo}
	aria-describedby={id}
	popovertarget={id}
	onclick={handleClick}
	onpointerenter={handlePointerEnter}
	onpointerleave={handlePointerLeave}
>
	<Icon name="info" size="sm" />
</button>

<!-- The click handler isn't an interaction: inside a <label>, a click on the bubble would
	otherwise also toggle the row's control, so it's cancelled -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<span
	bind:this={bubble}
	{id}
	role="tooltip"
	popover="auto"
	class="bubble"
	ontoggle={handleToggle}
	onpointerenter={handlePointerEnter}
	onpointerleave={handlePointerLeave}
	onclick={(e) => e.preventDefault()}
>
	{text}
</span>

<style>
	.info {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		/* A bigger tap area without pushing the text around */
		margin: -6px;
		padding: 0;
		border: none;
		border-radius: 50%;
		background: transparent;
		color: var(--color-text-subtle);
		vertical-align: middle;
		transition: color var(--transition-fast);
	}

	.info:hover,
	.info:focus-visible {
		color: var(--color-accent);
	}

	.bubble {
		position: fixed;
		inset: auto;
		margin: 0;
		max-width: min(280px, calc(100vw - 16px));
		padding: var(--space-2) var(--space-3);
		background: var(--color-surface);
		color: var(--color-text);
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-control);
		box-shadow: var(--shadow-raised);
		font-size: var(--text-sm);
		line-height: var(--leading-normal);
	}
</style>
