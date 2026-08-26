// Zero-dependency leaf module — deliberately has no imports (not even from culori indirectly).
// This lets browser-side consumers (e.g. the docs app's color-palette guide) deep-import just
// the role list without pulling the OKLCH/gamut-mapping machinery into their bundle.
export const ROLES = ['primary', 'accent', 'danger', 'info', 'warning', 'success', 'neutral'];
