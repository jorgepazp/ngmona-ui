import { converter, parse } from 'culori';

const toOklch = converter('oklch');

/**
 * Parses a seed color (hex string, or any CSS color culori understands, including `oklch(...)`)
 * into an OKLCH triple. Missing chroma/hue (e.g. a pure grey seed) resolve to 0.
 *
 * @param {string} input
 * @returns {{ l: number, c: number, h: number }}
 */
export function parseSeed(input) {
  const parsed = parse(input);
  if (!parsed) {
    throw new Error(`Could not parse seed color: "${input}"`);
  }
  const oklch = toOklch(parsed);
  return {
    l: oklch.l ?? 0,
    c: oklch.c ?? 0,
    h: oklch.h ?? 0,
  };
}
