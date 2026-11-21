<!--
	A row with an on/off switch, for use inside a `<Card list>` (e.g. turning features on or off).
	The whole row is tappable. Screen readers announce it as a switch.
-->
<script lang="ts">
	interface Props {
		label: string;
		description?: string;
		checked: boolean;
		onchange: (checked: boolean) => void;
	}

	let { label, description, checked, onchange }: Props = $props();
</script>

<label class="item">
	<span class="item__text">
		<span class="item__label">{label}</span>
		{#if description}
			<span class="text-meta">{description}</span>
		{/if}
	</span>
	<input
		type="checkbox"
		role="switch"
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
		flex-direction: column;
		gap: var(--space-1);
	}

	.item__label {
		font-size: var(--text-md);
	}

	/* The track, with the knob drawn as ::after */
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

	input:focus-visible + .switch {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}
</style>
