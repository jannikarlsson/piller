<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		photoUrl?: string | null;
		size?: 'sm' | 'lg';
	}

	let { photoUrl, size = 'sm' }: Props = $props();

	let failed = $state(false);
	// Try again if the photo changes (e.g. after signing in)
	$effect(() => {
		void photoUrl;
		failed = false;
	});
</script>

<span class="avatar avatar--{size}" aria-hidden="true">
	{#if photoUrl && !failed}
		<!-- Google profile photos refuse requests that send a referrer -->
		<img src={photoUrl} alt="" referrerpolicy="no-referrer" onerror={() => (failed = true)} />
	{:else}
		<Icon name="user" size={size === 'lg' ? 'xl' : 'lg'} />
	{/if}
</span>

<style>
	.avatar {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-radius: 50%;
	}

	.avatar--sm {
		width: 24px;
		height: 24px;
	}

	.avatar--lg {
		width: 64px;
		height: 64px;
		background: var(--color-accent-soft);
		color: var(--color-accent);
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
