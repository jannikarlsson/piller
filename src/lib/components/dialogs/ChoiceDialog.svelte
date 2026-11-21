<!--
	Pick one option from a list, shown inside a BottomSheet (e.g. theme, later language).
	Choosing an option calls `onselect` right away; there is no separate confirm button.
-->
<script lang="ts" generics="T extends string">
	import Card from '$lib/components/ui/Card.svelte';

	interface Option {
		value: T;
		label: string;
		description?: string;
	}

	interface Props {
		legend: string;
		options: Option[];
		selected: T;
		onselect: (value: T) => void;
	}

	let { legend, options, selected, onselect }: Props = $props();

	const name = $props.id();
</script>

<fieldset class="choices">
	<legend class="visually-hidden">{legend}</legend>
	<Card list>
		{#each options as option (option.value)}
			<label class="choice">
				<input
					type="radio"
					{name}
					value={option.value}
					checked={option.value === selected}
					onchange={() => onselect(option.value)}
				/>
				<span class="choice__text">
					<span class="choice__label">{option.label}</span>
					{#if option.description}
						<span class="text-meta">{option.description}</span>
					{/if}
				</span>
			</label>
		{/each}
	</Card>
</fieldset>

<style>
	.choices {
		border: none;
	}

	.choice {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-height: var(--row-height);
		padding: var(--row-padding-y) var(--row-padding-x);
		cursor: pointer;
		transition: background-color var(--transition-fast);
	}

	.choice:has(input:checked) {
		background: var(--color-accent-soft);
	}

	.choice input {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		margin: 0;
		accent-color: var(--color-accent);
	}

	.choice__text {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.choice__label {
		font-size: var(--text-md);
		font-weight: 500;
	}
</style>
