<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { signInWithGoogle } from '$lib/firebase';
	import ErrorMessage from '$lib/components/ui/ErrorMessage.svelte';
	import CabinetIllustration from './CabinetIllustration.svelte';

	let loading = $state(false);
	let error = $state<string | null>(null);

	async function handleLogin() {
		loading = true;
		error = null;
		const result = await signInWithGoogle();
		if (result.error === 'not_allowed') {
			error = t.login.errorNotAllowed;
		} else if (result.error) {
			error = t.login.errorGeneral;
		}
		loading = false;
	}
</script>

<div class="login-page">
	<div class="hero">
		<CabinetIllustration />
	</div>

	<div class="login-content">
		<div class="intro">
			<h1 class="intro__title">{t.app.name}</h1>
			<p class="intro__text text-body">{t.login.subtitle}.</p>
		</div>

		<div class="login-actions">
			{#if error}
				<ErrorMessage message={error} />
			{/if}

			<button type="button" class="google-btn" onclick={handleLogin} disabled={loading}>
				{#if loading}
					{t.login.loading}
				{:else}
					<svg class="google-icon" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
					{t.login.button}
				{/if}
			</button>
		</div>
	</div>
</div>

<style>
	.login-page {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		background: var(--color-surface);
		overflow-y: auto;
	}

	.hero {
		flex: 1 1 auto;
		min-height: 280px;
		max-height: 600px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: env(safe-area-inset-top, 0px);
		background: var(--color-accent-soft);
	}

	.hero :global(svg) {
		max-width: 390px;
	}

	.login-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
		width: 100%;
		max-width: 480px;
		margin: 0 auto;
		padding: var(--space-6) var(--space-6) calc(var(--space-10) + env(safe-area-inset-bottom, 0px));
	}

	.intro {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.intro__title {
		font-size: var(--text-2xl);
		font-weight: 600;
		line-height: var(--leading-tight);
		letter-spacing: -0.01em;
	}

	.intro__text {
		color: var(--color-text-muted);
	}

	.login-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.google-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		width: 100%;
		height: var(--size-control);
		padding: 0 var(--space-5);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-control);
		font-size: var(--text-md);
		font-weight: 500;
		color: var(--color-text);
		transition: background-color var(--transition-fast);
	}

	.google-btn:active:not(:disabled) {
		background: var(--color-bg);
	}

	.google-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.google-icon {
		flex-shrink: 0;
	}
</style>
