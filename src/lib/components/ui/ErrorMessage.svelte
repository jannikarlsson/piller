<script lang="ts">
	interface Props {
		message: string;
	}

	let { message }: Props = $props();
</script>

<p class="error" role="alert">{message}</p>

<style>
	.error {
		padding: var(--space-3) var(--space-4);
		background: var(--color-danger-bg);
		border: 1px solid var(--color-danger-border);
		border-radius: var(--radius-control);
		font-size: var(--text-sm);
		line-height: var(--leading-normal);
		color: var(--color-danger);
	}
</style>
