<!--
	Pick one option from a list: radio rows in a `<Card list>`, the selected row tinted.
	`onselect` is called as soon as an option is picked; add a confirm button around it if needed.
	Each option can have a `description` under its label, a short `detail` on the right
	(e.g. a count) and be `disabled`.
-->
<script lang="ts" generics="T extends string">
	import Card from '$lib/components/ui/Card.svelte';

	interface Option {
		value: T;
		label: string;
		description?: string;
		detail?: string;
		disabled?: boolean;
	}

	interface Props {
		/** Read by screen readers only; the drawer title says it visually. */
		legend: string;
		options: Option[];
		selected: T;
		onselect: (value: T) => void;
	}

	let { legend, options, selected, onselect }: Props = $props();

	const name = $props.id();
</script>

<fieldset class="group">
	<legend class="visually-hidden">{legend}</legend>
	<Card list>
		{#each options as option (option.value)}
			<label class="option" class:option--disabled={option.disabled}>
				<input
					type="radio"
					{name}
					value={option.value}
					checked={option.value === selected}
					disabled={option.disabled}
					onchange={() => onselect(option.value)}
				/>
				<span class="option__text">
					<span class="option__main">
						<span class="option__label">{option.label}</span>
						{#if option.description}
							<span class="text-meta">{option.description}</span>
						{/if}
					</span>
					{#if option.detail}
						<span class="option__detail text-meta">{option.detail}</span>
					{/if}
				</span>
			</label>
		{/each}
	</Card>
</fieldset>

<style>
	.group {
		border: none;
	}

	.option {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-height: var(--row-height);
		padding: var(--row-padding-y) var(--row-padding-x);
		cursor: pointer;
		transition: background-color var(--transition-fast);
	}

	.option:has(input:checked) {
		background: var(--color-accent-soft);
	}

	/* Rows fill a card that clips anything outside it, so the focus ring sits inside the row,
	   rounded like the card so its corners aren't cut off in the first and last row */
	.option:has(input:focus-visible) {
		outline: var(--focus-outline);
		outline-offset: -2px;
		border-radius: var(--radius-row-focus);
	}

	.option input:focus-visible {
		outline: none;
	}

	.option--disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.option input {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		margin: 0;
		accent-color: var(--color-accent);
	}

	.option__text {
		display: flex;
		flex: 1;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
		min-width: 0;
	}

	.option__main {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.option__label {
		font-size: var(--text-md);
		font-weight: 500;
	}

	.option__detail {
		white-space: nowrap;
	}
</style>
