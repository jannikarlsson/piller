<script lang="ts" module>
	export type IconName =
		| 'cabinet'
		| 'prescription'
		| 'checklist'
		| 'pill'
		| 'edit'
		| 'close'
		| 'plus'
		| 'check'
		| 'reset'
		| 'organizer'
		| 'user'
		| 'chevron-left'
		| 'chevron-right'
		| 'info';
</script>

<script lang="ts">
	interface Props {
		name: IconName;
		/** sm 16px (inside tags and checkboxes), md 20px (in buttons), lg 24px (menu), xl 32px (empty states) */
		size?: 'sm' | 'md' | 'lg' | 'xl';
		weight?: 'regular' | 'bold';
	}

	let { name, size = 'md', weight = 'regular' }: Props = $props();

	const PIXELS = { sm: 16, md: 20, lg: 24, xl: 32 } as const;
	const STROKE = { regular: 1.75, bold: 2.25 } as const;
</script>

<svg
	aria-hidden="true"
	width={PIXELS[size]}
	height={PIXELS[size]}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={STROKE[weight]}
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
	{:else if name === 'user'}
		<circle cx="12" cy="8" r="4" />
		<path d="M4 21a8 8 0 0 1 16 0" />
	{:else if name === 'chevron-left'}
		<path d="M15 18l-6-6 6-6" />
	{:else if name === 'chevron-right'}
		<path d="M9 18l6-6-6-6" />
	{:else if name === 'info'}
		<circle cx="12" cy="12" r="9" />
		<path d="M12 11v5" />
		<path d="M12 7.5v.01" />
	{:else if name === 'reset'}
		<path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
		<path d="M3 3v5h5" />
	{/if}
</svg>
