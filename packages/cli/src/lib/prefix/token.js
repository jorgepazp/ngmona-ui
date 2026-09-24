/**
 * Token-level helpers for Tailwind v4 class prefixing. In v4 the prefix is written like a
 * variant and must come first (`tw:hover:bg-primary-300`), and the important modifier goes at the
 * very end (`tw:border-none!`) — the legacy leading `!` is not accepted once a prefix is in front.
 */

/** Tailwind v4 only accepts lowercase ASCII letters as a prefix (`prefix(tw)`). */
export const PREFIX_PATTERN = /^[a-z]+$/;

/** `group`, `peer` and their named forms (`group/item`) — marker classes, not utilities. */
const MARKER_PATTERN = /^(group|peer)(\/[\w-]+)?$/;

/**
 * Splits `str` on `sep`, ignoring separators inside `[...]` or `(...)` — so arbitrary variants
 * (`[&:not(:active)]:focus:…`) and arbitrary values (`w-[calc(100%-2rem)]`) stay whole.
 */
export function splitTopLevel(str, sep) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '[' || ch === '(') depth++;
    else if ((ch === ']' || ch === ')') && depth > 0) depth--;
    else if (ch === sep && depth === 0) {
      parts.push(str.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(str.slice(start));
  return parts;
}

export function isPrefixed(token, prefix) {
  return token.startsWith(`${prefix}:`);
}

export function isMarker(token) {
  return MARKER_PATTERN.test(token);
}

/**
 * A single lowercase word with no variant, modifier or value (`hidden`, `block`, `fixed`,
 * `contents`…). These double as ordinary words and CSS values, so outside a class context they
 * are reported instead of rewritten.
 */
export function isBareWord(token) {
  return /^!?-?[a-z]+!?$/.test(token);
}

/** `!border-none` -> `tw:border-none!`, `hover:bg-x` -> `tw:hover:bg-x`, `-mt-2` -> `tw:-mt-2`. */
export function prefixToken(token, prefix) {
  if (isPrefixed(token, prefix)) return token;
  const parts = splitTopLevel(token, ':');
  let base = parts.pop();
  let important = false;
  if (base.startsWith('!')) {
    important = true;
    base = base.slice(1);
  } else if (base.endsWith('!')) {
    important = true;
    base = base.slice(0, -1);
  }
  return [prefix, ...parts, base].join(':') + (important ? '!' : '');
}
