<script lang="ts">
	import InfoTip from '#lib/components/ui/InfoTip.svelte';

	interface Props {
		label: string;
		info?: string;
		checked: boolean;
		onchange: (checked: boolean) => void;
	}

	let { label, info, checked, onchange }: Props = $props();

	const id = $props.id();
	const labelId = `${id}-label`;
	const infoId = `${id}-info`;
</script>

<label class="item" for={id}>
	<span class="item__text">
		<span class="item__label" id={labelId}>{label}</span>
		{#if info}
			<InfoTip text={info} id={infoId} />
		{/if}
	</span>
	<input
		{id}
		type="checkbox"
		role="switch"
		aria-labelledby={labelId}
		aria-describedby={info ? infoId : undefined}
		class="visually-hidden"
		{checked}
		onchange={(e) => onchange(e.currentTarget.checked)}
	/>
	<span class="switch" class:switch--on={checked} aria-hidden="true"></span>
</label>

<style>
	.item {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-height: var(--row-height);
		padding: var(--row-padding-y) var(--row-padding-x);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.item__text {
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.item__label {
		font-size: var(--text-md);
	}

	.switch {
		position: relative;
		flex-shrink: 0;
		width: 44px;
		height: 26px;
		border-radius: 13px;
		background: var(--color-border);
		transition: background-color var(--transition-fast);
	}

	.switch::after {
		content: '';
		position: absolute;
		top: 3px;
		left: 3px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--color-surface);
		box-shadow: var(--shadow-raised);
		transition: transform var(--transition-fast);
	}

	.switch--on {
		background: var(--color-accent);
	}

	.switch--on::after {
		transform: translateX(18px);
	}

	.item:has(input:focus-visible) {
		outline: var(--focus-outline);
		outline-offset: -2px;
		border-radius: var(--radius-row-focus);
	}
</style>
