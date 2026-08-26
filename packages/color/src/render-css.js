import { RAMP_STEPS } from './ramp.js';
import { formatOklch } from './gamut.js';

const BASE_STEP = 500;

const SECTION_RULES = [
  { prefix: 'color-surface-', label: 'Semantic surface scale' },
  { prefix: 'color-text-', label: 'Semantic text scale' },
  { prefix: 'color-icon-', label: 'Semantic icon scale' },
  { prefix: 'color-link', label: 'Semantic link scale' },
  { prefix: 'color-border-', label: 'Semantic border scale' },
  { prefix: 'color-divider', label: 'Divider scale' },
];

function sectionFor(varName) {
  return SECTION_RULES.find((rule) => varName.startsWith(rule.prefix))?.label ?? null;
}

/**
 * Renders a built theme as a Tailwind v4 `@theme { ... }` CSS block, in two layers:
 *
 * 1. Primitives — `--color-<role>-<step>` for every ramp step. These ARE real, self-contained
 *    OKLCH literals: the actual computed output of the seed + ramp algorithm. Hand-editing one
 *    is safe and affects only that single step.
 * 2. Everything else — the bare `--color-<role>` alias (references `<role>-500`) and the whole
 *    semantic block (from `theme.semantic`, already resolved to `var()`/`color-mix()` strings by
 *    semantic-map.js) — are REFERENCES, not copies. Changing a primitive cascades to every alias
 *    and semantic token that points at it, by design.
 *
 * @param {{ ramps: Record<string, Record<number, {l:number,c:number,h:number}>>, semantic: Record<string,string> }} theme
 * @param {readonly string[]} roles
 * @param {string} [regenerateHint] caller-specific instructions for how to change a brand color
 */
export function renderThemeColorsBlock(
  theme,
  roles,
  regenerateHint = 'edit scripts/theme.seeds.json and re-run `npm run theme:generate`.',
) {
  const { ramps, semantic } = theme;
  const lines = [];

  lines.push('/*');
  lines.push(' * GENERATED FILE — do not hand-maintain the file as a whole. To change a brand color,');
  lines.push(` * ${regenerateHint}`);
  lines.push(' *');
  lines.push(' * Ramp steps (--color-<role>-<step>) are real literals, safe to hand-edit individually.');
  lines.push(' * Everything else (the bare --color-<role> alias, and every semantic token below) is a');
  lines.push(' * var()/color-mix() reference to a ramp step — editing a ramp step cascades to every alias');
  lines.push(' * and semantic token derived from it. To change just one semantic token, override that');
  lines.push(' * specific property downstream instead of editing the primitive it points at.');
  lines.push(' *');
  lines.push(' * `static` (not plain `@theme`) is required: Tailwind v4 otherwise only emits a theme');
  lines.push(' * variable into the compiled CSS when some utility class in the scanned templates');
  lines.push(' * literally references it. Most ramp steps (e.g. `primary-950`) are never used as a');
  lines.push(' * Tailwind utility directly — they still need to exist as real custom properties for');
  lines.push(' * anything reading them via var()/getComputedStyle outside of a Tailwind class, e.g. the');
  lines.push(' * docs app\'s color-palette guide.');
  lines.push(' */');
  lines.push('@theme static {');

  for (const role of roles) {
    const ramp = ramps[role];
    lines.push(`  --color-${role}: var(--color-${role}-${BASE_STEP});`);
    for (const step of RAMP_STEPS) {
      lines.push(`  --color-${role}-${step}: ${formatOklch(ramp[step])};`);
    }
    lines.push('');
  }

  let currentSection = null;
  for (const [varName, value] of Object.entries(semantic)) {
    const section = sectionFor(varName);
    if (section && section !== currentSection) {
      lines.push(`  /* ${section} */`);
      currentSection = section;
    }
    lines.push(`  --${varName}: ${value};`);
  }

  lines.push('}');
  lines.push('');

  return lines.join('\n');
}
