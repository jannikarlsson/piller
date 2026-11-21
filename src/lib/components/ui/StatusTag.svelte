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
		<Icon name={tone === 'ok' ? 'check' : 'close'} size="sm" weight="bold" />
	</span>
	<span class="tag__label">{label}</span>
</span>

<style>
	.tag {
		flex-shrink: 0;
		width: 118px;
		display: flex;
		align-items: stretch;
		font-size: var(--text-xs);
		line-height: 26px;
		font-weight: 500;
		border: 1px solid;
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.tag--ok {
		border-color: var(--tag-ok-border);
		background: var(--tag-ok-bg);
		color: var(--tag-ok-text);
	}

	.tag--danger {
		border-color: var(--tag-danger-border);
		background: var(--tag-danger-bg);
		color: var(--tag-danger-text);
	}

	.tag__icon {
		width: 26px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tag--ok .tag__icon {
		background: var(--tag-ok-icon-bg);
		color: var(--tag-ok-icon);
	}

	.tag--danger .tag__icon {
		background: var(--tag-danger-icon-bg);
		color: var(--tag-danger-icon);
	}

	.tag__label {
		flex: 1;
		padding: 0 var(--space-2);
		text-align: center;
		white-space: nowrap;
	}
</style>
