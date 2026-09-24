import postcss from 'postcss';
import { prefixToken } from '../../src/lib/prefix/token.js';

/** `.hover\:bg-primary-300\/5` -> `hover:bg-primary-300/5` (handles `\32 xl`-style hex escapes too). */
function unescapeIdent(ident) {
  return ident.replace(/\\([0-9a-fA-F]{1,6} ?|.)/g, (_, esc) =>
    /^[0-9a-fA-F]{1,6} ?$/.test(esc) ? String.fromCodePoint(parseInt(esc.trim(), 16)) : esc,
  );
}

const CLASS_IN_SELECTOR = /\.((?:\\[0-9a-fA-F]{1,6} ?|\\.|[\w-])+)/g;

function mapSelectorClasses(selector, mapClass) {
  return selector.replace(CLASS_IN_SELECTOR, (_, ident) => `.«${mapClass(unescapeIdent(ident))}»`);
}

/**
 * One normalized line per rule / at-rule, in a canonical form where the unprefixed build is mapped
 * onto the prefixed one: every class in a selector goes through `prefixToken` (so `!border-none`
 * lines up with `tw:border-none!`), and theme variables in the prefixed build lose their `--tw-`
 * namespace again (`--tw-color-primary-500` -> `--color-primary-500`).
 *
 * @param {string} css
 * @param {{ prefix?: string, fromPrefixed?: boolean, themeVars?: Set<string> }} opts
 */
export function normalizeRules(css, { prefix, fromPrefixed = false, internalVars = new Set() }) {
  // Tailwind's own internal variables are already `--tw-*` in both builds (`--tw-shadow-color`);
  // any other `--tw-*` in the prefixed build is a prefixed theme variable.
  const renameVars = (value) =>
    fromPrefixed
      ? value.replace(/--([\w-]+)/g, (m, name) =>
          name.startsWith(`${prefix}-`) && !internalVars.has(name) ? `--${name.slice(prefix.length + 1)}` : m,
        )
      : value;
  const mapClass = fromPrefixed ? (c) => c : (c) => prefixToken(c, prefix);

  const lines = [];
  const context = (node) => {
    const chain = [];
    for (let parent = node.parent; parent && parent.type !== 'root'; parent = parent.parent) {
      if (parent.type === 'atrule') chain.unshift(`@${parent.name} ${renameVars(parent.params)}`);
      if (parent.type === 'rule') chain.unshift(mapSelectorClasses(parent.selector, mapClass));
    }
    return chain.join(' > ');
  };
  const decls = (node) => {
    const nested = nestedColorMixProps(node);
    return (node.nodes ?? [])
      .filter((n) => n.type === 'decl')
      .map((d) =>
        nested.has(d.prop)
          ? `${renameVars(d.prop)}:<color-mix fallback>`
          : `${renameVars(d.prop)}:${renameVars(d.value)}${d.important ? '!important' : ''}`,
      )
      .join(';');
  };

  postcss.parse(css).walk((node) => {
    if (node.type === 'rule' && isVariableBag(node)) {
      // `:root` (theme variables) and the `@layer properties` defaults are one rule each whose
      // contents depend on every utility in the build — compare them one declaration at a time.
      for (const d of node.nodes.filter((n) => n.type === 'decl')) {
        const value = nestedColorMixProps(node).has(d.prop) ? '<color-mix fallback>' : renameVars(d.value);
        lines.push(`${context(node)} | ${node.selector} { ${renameVars(d.prop)}:${value} }`);
      }
    } else if (node.type === 'rule' && isColorMixFallback(node)) {
      // Known Tailwind v4 difference, not something ngmona controls: for a theme color with an
      // opacity modifier (`bg-primary-300/5`), the unprefixed build pre-mixes the fallback for
      // browsers without color-mix(), while a prefixed build falls back to the opaque color. The
      // real rule (the @supports block right after) is still compared.
      lines.push(`${context(node)} | ${mapSelectorClasses(node.selector, mapClass)} { <color-mix fallback> }`);
    } else if (node.type === 'rule') {
      lines.push(`${context(node)} | ${mapSelectorClasses(node.selector, mapClass)} { ${decls(node)} }`);
    } else if (node.type === 'atrule' && node.nodes?.some((n) => n.type === 'decl')) {
      lines.push(`${context(node)} | @${node.name} ${renameVars(node.params)} { ${decls(node)} }`);
    }
  });
  return lines.sort();
}

function isVariableBag(rule) {
  if (/:root/.test(rule.selector)) return true;
  for (let parent = rule.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && parent.name === 'layer' && parent.params === 'properties') return true;
  }
  return false;
}

/**
 * Same fallback, nested form: `.x { prop: <fallback>; @supports (color: color-mix(…)) { prop: … } }`.
 * Returns the props the nested @supports block overrides.
 */
function nestedColorMixProps(rule) {
  const props = new Set();
  for (const child of rule.nodes ?? []) {
    if (child.type === 'atrule' && child.name === 'supports' && child.params.includes('color-mix')) {
      child.walkDecls((d) => props.add(d.prop));
    }
  }
  return props;
}

/** A rule immediately followed by `@supports (color: color-mix(…)) { <same selector> { … } }`. */
function isColorMixFallback(rule) {
  const next = rule.next();
  return (
    next?.type === 'atrule' &&
    next.name === 'supports' &&
    next.params.includes('color-mix') &&
    next.nodes?.some((n) => n.type === 'rule' && n.selector === rule.selector)
  );
}

/** Every `--tw-*` name (without `--`) in an unprefixed build — Tailwind's internal variables. */
export function internalVariableNames(css) {
  return new Set([...css.matchAll(/--(tw-[\w-]+)/g)].map((m) => m[1]));
}

/** Selectors of every rule in the utilities layer. */
export function utilitySelectors(css) {
  const selectors = [];
  postcss.parse(css).walkAtRules('layer', (layer) => {
    if (layer.params !== 'utilities') return;
    layer.walkRules((rule) => selectors.push(rule.selector));
  });
  return selectors;
}
