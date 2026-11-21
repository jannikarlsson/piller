import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	// Formatting is Prettier's job, so ESLint's formatting rules are turned off
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			// TypeScript already checks for undefined names, and does it better
			'no-undef': 'off',
			// Wants every link wrapped in resolve() to support a base path. The app is served
			// from the root of its domain, so that would only add noise
			'svelte/no-navigation-without-resolve': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser
			}
		}
	},
	{ ignores: ['build/', 'dist/', '.svelte-kit/', '.firebase/'] }
);
