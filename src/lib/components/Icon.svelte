<script lang="ts" module>
	export type IconName =
		| 'cabinet'
		| 'prescription'
		| 'checklist'
		| 'pill'
		| 'settings'
		| 'edit'
		| 'close'
		| 'plus'
		| 'check'
		| 'reset'
		| 'organizer';
</script>

<script lang="ts">
	interface Props {
		name: IconName;
		size?: number;
		strokeWidth?: number;
	}

	let { name, size = 24, strokeWidth = 1.75 }: Props = $props();
</script>

<svg
	aria-hidden="true"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
>
	{#if name === 'cabinet'}
		<rect x="4" y="3" width="16" height="18" rx="2" />
		<path d="M4 12h16" />
		<path d="M10 7.5h4" />
		<path d="M10 16.5h4" />
	{:else if name === 'prescription'}
		<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
		<path d="M14 3v5h5" />
		<path d="M9 13h6" />
		<path d="M9 17h4" />
	{:else if name === 'checklist'}
		<path d="M10 6h10" />
		<path d="M10 12h10" />
		<path d="M10 18h10" />
		<path d="M4 6l1.5 1.5L8 5" />
		<path d="M4 12l1.5 1.5L8 11" />
		<path d="M4 18l1.5 1.5L8 17" />
	{:else if name === 'pill'}
		<path d="M10.5 20.5a5 5 0 0 1-7-7l7-7a5 5 0 0 1 7 7z" />
		<path d="M8.5 8.5l7 7" />
	{:else if name === 'settings'}
		<circle cx="12" cy="12" r="3" />
		<path
			d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
		/>
	{:else if name === 'edit'}
		<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />
		<path d="M13.5 6.5l4 4" />
	{:else if name === 'close'}
		<path d="M6 6l12 12" />
		<path d="M18 6L6 18" />
	{:else if name === 'plus'}
		<path d="M12 5v14" />
		<path d="M5 12h14" />
	{:else if name === 'check'}
		<path d="M5 12l5 5L19 7" />
	{:else if name === 'organizer'}
		<rect x="3" y="9" width="18" height="10" rx="2" />
		<path d="M7.5 9v10" />
		<path d="M12 9v10" />
		<path d="M16.5 9v10" />
		<path d="M4 9l1.2-3h13.6L20 9" />
	{:else if name === 'reset'}
		<path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
		<path d="M3 3v5h5" />
	{/if}
</svg>
