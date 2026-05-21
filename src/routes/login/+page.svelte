<script lang="ts">
	import { t } from '$lib/i18n/sv';
	import { signInWithGoogle } from '$lib/firebase';
	import PillDecor from '$lib/components/PillDecor.svelte';

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
	<PillDecor count={10} />

	<div class="login-content">
		<div class="logo-area">
			<div class="logo-icon">💊</div>
			<h1 class="logo-name">Piller</h1>
			<p class="logo-sub">apoteksskåpet</p>
		</div>

		<p class="login-subtitle">{t.login.subtitle}</p>

		{#if error}
			<div class="error-box">{error}</div>
		{/if}

		<button class="google-btn" onclick={handleLogin} disabled={loading}>
			{#if loading}
				<span class="spinner">○</span>
				{t.login.loading}
			{:else}
				<svg class="google-icon" viewBox="0 0 24 24" width="18" height="18">
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

<style>
	.login-page {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100dvh;
		overflow: hidden;
		padding: 2rem;
	}

	.login-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		width: 100%;
		max-width: 320px;
	}

	.logo-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
	}

	.logo-icon {
		font-size: 3rem;
		animation: wobble 4s ease-in-out infinite;
		margin-bottom: 0.5rem;
	}

	@keyframes wobble {
		0%, 100% { transform: rotate(-8deg); }
		50% { transform: rotate(8deg); }
	}

	.logo-name {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-weight: 800;
		font-size: 5rem;
		color: #ffffff;
		letter-spacing: -0.04em;
		line-height: 1;
		margin: 0;
	}

	.logo-sub {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(196, 181, 253, 0.45);
		margin: 0;
	}

	.login-subtitle {
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 1rem;
		font-weight: 500;
		color: rgba(196, 181, 253, 0.7);
		text-align: center;
		line-height: 1.5;
		margin: 0;
	}

	.error-box {
		background: rgba(196, 100, 120, 0.12);
		border: 1px solid rgba(196, 100, 120, 0.4);
		border-radius: 0.75rem;
		padding: 0.75rem 1rem;
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 0.85rem;
		color: #e8a0ad;
		text-align: center;
		width: 100%;
	}

	.google-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		width: 100%;
		padding: 1rem 1.5rem;
		background: #ffffff;
		border: none;
		border-radius: 1rem;
		font-family: 'Bricolage Grotesque', sans-serif;
		font-size: 1.05rem;
		font-weight: 700;
		color: #1a0533;
		cursor: pointer;
		transition: transform 0.12s ease, opacity 0.12s ease;
	}

	.google-btn:active:not(:disabled) {
		transform: scale(0.97);
	}

	.google-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.google-icon {
		flex-shrink: 0;
	}

	.spinner {
		animation: spin 1s linear infinite;
		display: inline-block;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
</style>
