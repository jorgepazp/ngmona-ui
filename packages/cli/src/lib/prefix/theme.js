/**
 * With `prefix(tw)`, Tailwind emits every theme variable under the prefix (`--color-primary-500`
 * becomes `--tw-color-primary-500`), but it leaves `var()` references inside theme *values* as
 * written. A semantic token like `--color-text-active-light: var(--color-primary-300)` would then
 * point at a variable that no longer exists. The names declared in `@theme` stay unprefixed (that's
 * what Tailwind expects); only the references inside `@theme` blocks are rewritten.
 *
 * Idempotent: references already carrying the prefix are left alone.
 */
export function prefixThemeReferences(css, prefix) {
  if (!prefix) return css;
  let out = '';
  let cursor = 0;
  const themeStart = /@theme\b[^{]*\{/g;
  let match;
  while ((match = themeStart.exec(css))) {
    const bodyStart = match.index + match[0].length;
    let depth = 1;
    let i = bodyStart;
    while (i < css.length && depth > 0) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') depth--;
      i++;
    }
    const body = css.slice(bodyStart, i);
    out += css.slice(cursor, bodyStart) + body.replace(new RegExp(`var\\(--(?!${prefix}-)`, 'g'), `var(--${prefix}-`);
    cursor = i;
    themeStart.lastIndex = i;
  }
  return out + css.slice(cursor);
}
