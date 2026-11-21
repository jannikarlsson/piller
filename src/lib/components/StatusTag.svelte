<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		tone: 'ok' | 'danger';
		label: string;
	}

	let { tone, label }: Props = $props();
</script>

<span class="tag tag--{tone}">
	<span class="tag__icon">
		<Icon name={tone === 'ok' ? 'check' : 'close'} size={15} strokeWidth={2.5} />
	</span>
	<span class="tag__label">{label}</span>
</span>

<style>
	.tag {
		flex-shrink: 0;
		width: 118px;
		display: flex;
		align-items: stretch;
		font-size: 13px;
		line-height: 26px;
		font-weight: 500;
		border: 1px solid;
		border-radius: 5px;
		overflow: hidden;
	}

	.tag--ok {
		border-color: var(--color-ok-border);
		background: var(--color-ok-bg);
		color: var(--color-ok);
	}

	.tag--danger {
		border-color: var(--color-danger-border);
		background: var(--color-danger-bg);
		color: var(--color-danger);
	}

	.tag__icon {
		width: 26px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ffffff;
	}

	.tag--ok .tag__icon {
		background: var(--color-ok);
	}

	.tag--danger .tag__icon {
		background: var(--color-danger);
	}

	.tag__label {
		flex: 1;
		padding: 0 8px;
		text-align: center;
		white-space: nowrap;
	}
</style>
