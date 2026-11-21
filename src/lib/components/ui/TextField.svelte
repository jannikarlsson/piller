<!--
	A labelled text input. Use `bind:value`.
	`multiline` gives a two-line text box that can be dragged taller, for longer notes.
-->
<script lang="ts">
	interface Props {
		label: string;
		value: string;
		placeholder?: string;
		required?: boolean;
		multiline?: boolean;
	}

	let {
		label,
		value = $bindable(),
		placeholder,
		required = false,
		multiline = false
	}: Props = $props();

	const id = $props.id();
</script>

<div class="field">
	<label class="text-label" for={id}>{label}</label>
	{#if multiline}
		<textarea {id} class="input input--multiline" rows="2" bind:value {placeholder} {required}></textarea>
	{:else}
		<input {id} class="input" type="text" bind:value {placeholder} {required} autocomplete="off" />
	{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.input {
		font-size: var(--text-md);
		height: var(--size-control);
		padding: 0 var(--space-4);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-control);
		color: var(--color-text);
		outline: none;
		transition:
			border-color var(--transition-fast),
			box-shadow var(--transition-fast);
	}

	.input--multiline {
		height: auto;
		padding: var(--space-3) var(--space-4);
		line-height: var(--leading-normal);
		resize: vertical;
	}

	.input::placeholder {
		color: var(--color-placeholder);
	}

	.input:focus {
		border-color: var(--color-accent);
		box-shadow: var(--focus-ring);
	}
</style>
