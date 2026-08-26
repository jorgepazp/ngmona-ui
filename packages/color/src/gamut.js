import { converter, toGamut } from 'culori';

// toGamut(dest, workingMode) binary-search-reduces chroma in `workingMode` (oklch — holding L
// and H fixed, so hue never shifts) until the color fits `dest`'s gamut, but returns the result
// converted INTO `dest` (rgb), not `workingMode` — despite the argument name suggesting
// otherwise. Confirmed by reading culori's source (`destConv(...)` at the end of toGamut).
const mapToSrgb = toGamut('rgb', 'oklch');
const toOklch = converter('oklch');

/**
 * Gamut-maps an OKLCH color into sRGB and formats it as a CSS `oklch()` string, rounded for
 * readability/diffability (L to whole percent, C to 3 decimals, H to 1 decimal).
 *
 * @param {{ l: number, c: number, h: number }} oklch
 * @param {number} [alpha] 0-1; omitted from output when undefined (fully opaque)
 * @returns {string}
 */
export function formatOklch(oklch, alpha) {
  const clippedRgb = mapToSrgb({ mode: 'oklch', l: oklch.l, c: oklch.c, h: oklch.h || 0 });
  // Convert back to oklch so we always format the actual in-gamut coordinates, not the
  // pre-clipping input (which may have had chroma reduced during mapping).
  const mapped = toOklch(clippedRgb);
  const l = Math.round((mapped.l ?? 0) * 100);
  const c = Math.round((mapped.c ?? 0) * 1000) / 1000;
  const h = Math.round((mapped.h ?? 0) * 10) / 10;
  const alphaSuffix = alpha === undefined ? '' : ` / ${Math.round(alpha * 100)}%`;
  return `oklch(${l}% ${c} ${h}${alphaSuffix})`;
}
