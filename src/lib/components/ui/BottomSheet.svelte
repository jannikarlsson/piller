<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t } from '$lib/i18n/sv';
	import Icon from './Icon.svelte';
	import Button from './Button.svelte';

	interface Props {
		title: string;
		onclose: () => void;
		children: Snippet;
	}

	let { title, onclose, children }: Props = $props();

	const titleId = `sheet-title-${Math.random().toString(36).slice(2, 8)}`;

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="sheet-backdrop" onclick={onclose} role="presentation"></div>
<div class="sheet" role="dialog" aria-modal="true" aria-labelledby={titleId}>
	<div class="sheet__handle" aria-hidden="true"></div>
	<div class="sheet__header">
		<h2 class="text-title" id={titleId}>{title}</h2>
		<Button variant="quiet" size="icon" ariaLabel={t.common.close} onclick={onclose}>
			<Icon name="close" size={20} />
		</Button>
	</div>
	{@render children()}
</div>

<style>
	.sheet-backdrop {
		position: fixed;
		inset: 0;
		background: var(--backdrop);
		z-index: 200;
	}

	.sheet {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 201;
		max-height: 90dvh;
		overflow-y: auto;
		background: var(--color-surface);
		border-radius: 16px 16px 0 0;
		padding: var(--space-2) var(--space-5) calc(var(--space-8) + env(safe-area-inset-bottom, 0px));
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}

	.sheet__handle {
		width: 36px;
		height: 4px;
		background: var(--color-handle);
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
