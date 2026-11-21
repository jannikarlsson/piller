<script lang="ts">
	interface Props {
		message: string;
	}

	let { message }: Props = $props();
</script>

<p class="error" role="alert">{message}</p>

<style>
	.error {
		padding: 12px 14px;
		background: var(--color-danger-bg);
		border: 1px solid var(--color-danger-border);
		border-radius: var(--radius-control);
		font-size: 14px;
		line-height: 1.4;
		color: var(--color-danger);
	}
</style>
