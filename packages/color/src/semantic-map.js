/**
 * Declarative default mapping from every semantic design token to a primitive ramp step (or a
 * literal, for values that aren't derived from any role — pure white/black, or a true one-off
 * brand color like "visited link purple"). This is a v1 default table, not a permanent formula.
 *
 * `resolveSemanticLayer` turns each entry into a `var()` (or `color-mix()`, for alpha) reference
 * to the primitive it names — NOT a frozen literal. This is deliberate: primitives (the ramp
 * steps in theme-colors.css, and `--color-white`/`--color-black` in styles.css) are the only
 * layer meant to hold real computed values; every semantic token here is a *relationship* to a
 * primitive, so changing the primitive (a seed color) cascades to everything that references it.
 * To override one semantic token without affecting siblings that share its primitive, override
 * that specific `--color-<semantic-name>` property downstream (e.g. in theme-dark.css, or a
 * project-level stylesheet) rather than editing the primitive it points at.
 *
 * Note: several semantic names contain the word "neutral" as part of their OWN name (e.g.
 * `color-border-neutral`) and now resolve against the primitive scale that is ALSO named
 * `neutral` (e.g. `var(--color-neutral-300)`). These are two distinct custom properties — no
 * collision — it's just a naming coincidence, not a copy-paste bug.
 */
export const SEMANTIC_MAP = {
  // Semantic surface scale
  'color-surface-white': { literal: 'var(--color-white)' },
  'color-surface-lighter': { scale: 'neutral', step: 50 },
  'color-surface-light': { scale: 'neutral', step: 100 },
  'color-surface-medium': { scale: 'neutral', step: 200 },
  'color-surface-dark': { scale: 'neutral', step: 500 },
  'color-surface-enabled': { scale: 'neutral', step: 100 },
  'color-surface-enabled-light': { literal: 'var(--color-white)' },
  'color-surface-disabled': { scale: 'neutral', step: 300 },
  'color-surface-hover': { scale: 'neutral', step: 200 },
  'color-surface-active': { scale: 'primary', step: 500 },
  'color-surface-active-inverse': { literal: 'var(--color-white)' },
  'color-surface-backdrop': { scale: 'neutral', step: 900, alpha: 0.5 },
  'color-surface-success': { scale: 'success', step: 700 },
  'color-surface-success-light': { scale: 'success', step: 100 },
  // Filled severity controls (buttons): light enough for dark text (neutral-900) in both modes.
  'color-surface-success-medium': { scale: 'success', step: 400 },
  'color-surface-info': { scale: 'info', step: 700 },
  'color-surface-info-light': { scale: 'info', step: 100 },
  // Filled severity controls (buttons): light enough for dark text (neutral-900) in both modes.
  'color-surface-info-medium': { scale: 'info', step: 400 },
  'color-surface-danger': { scale: 'danger', step: 700 },
  'color-surface-danger-light': { scale: 'danger', step: 100 },
  // Filled severity controls (buttons): light enough for dark text (neutral-900) in both modes.
  'color-surface-danger-medium': { scale: 'danger', step: 400 },
  'color-surface-warning': { scale: 'warning', step: 700 },
  'color-surface-warning-light': { scale: 'warning', step: 100 },
  // Filled severity controls (buttons): light enough for dark text (neutral-900) in both modes.
  'color-surface-warning-medium': { scale: 'warning', step: 400 },

  // Semantic text scale
  'color-text-primary': { scale: 'neutral', step: 600 },
  'color-text-secondary': { scale: 'neutral', step: 800 },
  'color-text-subdued': { scale: 'neutral', step: 400 },
  'color-text-disabled': { scale: 'neutral', step: 200 },
  'color-text-primary-inverse': { literal: 'var(--color-white)' },
  'color-text-active': { scale: 'primary', step: 500 },
  'color-text-active-light': { scale: 'primary', step: 300 },
  'color-text-active-inverse': { literal: 'var(--color-white)' },
  'color-text-success': { scale: 'success', step: 700 },
  'color-text-info': { scale: 'info', step: 800 },
  'color-text-danger': { scale: 'danger', step: 700 },
  'color-text-warning': { scale: 'warning', step: 700 },

  // Semantic icon scale
  'color-icon-default': { scale: 'neutral', step: 600 },
  'color-icon-subdued': { scale: 'neutral', step: 400 },
  'color-icon-disabled': { scale: 'neutral', step: 200 },
  'color-icon-default-inverse': { literal: 'var(--color-white)' },
  'color-icon-success': { scale: 'success', step: 700 },
  'color-icon-success-light': { scale: 'success', step: 500 },
  'color-icon-info': { scale: 'info', step: 700 },
  'color-icon-info-light': { scale: 'info', step: 500 },
  'color-icon-danger': { scale: 'danger', step: 700 },
  'color-icon-danger-light': { scale: 'danger', step: 500 },
  'color-icon-warning': { scale: 'warning', step: 700 },
  'color-icon-warning-light': { scale: 'warning', step: 500 },
  'color-icon-active': { scale: 'primary', step: 500 },
  'color-icon-active-light': { scale: 'primary', step: 300 },

  // Semantic link scale
  'color-link': { scale: 'info', step: 500 },
  'color-link-hover': { scale: 'info', step: 300 },
  'color-link-pressed': { scale: 'info', step: 800 },
  // True one-off: "visited link purple" is a web convention, not derived from any brand role.
  'color-link-visited': { literal: '#4a2187' },
  'color-link-disabled': { scale: 'neutral', step: 200 },
  'color-link-inverse': { literal: 'var(--color-white)' },
  'color-link-hover-inverse': { literal: 'color-mix(in oklab, var(--color-white) 75%, transparent)' },
  'color-link-pressed-inverse': { literal: 'var(--color-white)' },
  'color-link-disabled-inverse': { literal: 'color-mix(in oklab, var(--color-white) 40%, transparent)' },
  'color-link-visited-inverse': { literal: '#c2ccf5' },

  // Semantic border scale
  'color-border-neutral-light': { scale: 'neutral', step: 50 },
  'color-border-neutral': { scale: 'neutral', step: 200 },
  'color-border-neutral-medium': { scale: 'neutral', step: 500 },
  'color-border-neutral-dark': { scale: 'neutral', step: 600 },
  'color-border-state': { scale: 'neutral', step: 200 },
  'color-border-hover': { scale: 'neutral', step: 400 },
  'color-border-focused': { scale: 'neutral', step: 800 },
  'color-border-disabled': { scale: 'neutral', step: 300 },
  'color-border-active': { scale: 'primary', step: 500 },

  // Divider scale
  'color-divider-light': { scale: 'neutral', step: 50 },
  'color-divider': { scale: 'neutral', step: 100 },
  'color-divider-medium': { scale: 'neutral', step: 200 },
  'color-divider-dark': { scale: 'neutral', step: 300 },
};

/**
 * Resolves every entry in SEMANTIC_MAP against the available ramps into a flat map of
 * CSS-variable-name -> CSS value (a `var()`/`color-mix()` reference, or a passthrough literal).
 * Ramps are only used to validate that the referenced scale/step actually exists — the emitted
 * string never depends on the step's numeric value, just its name.
 *
 * @param {Record<string, Record<number, unknown>>} ramps
 */
export function resolveSemanticLayer(ramps) {
  const resolved = {};

  for (const [varName, entry] of Object.entries(SEMANTIC_MAP)) {
    if ('literal' in entry) {
      resolved[varName] = entry.literal;
      continue;
    }

    const ramp = ramps[entry.scale];
    if (!ramp) {
      throw new Error(`Unknown scale "${entry.scale}" referenced by semantic token --${varName}`);
    }
    if (!ramp[entry.step]) {
      throw new Error(`Unknown step ${entry.step} for scale "${entry.scale}" (token --${varName})`);
    }

    resolved[varName] =
      entry.alpha === undefined
        ? `var(--color-${entry.scale}-${entry.step})`
        : `color-mix(in oklab, var(--color-${entry.scale}-${entry.step}) ${Math.round(entry.alpha * 100)}%, transparent)`;
  }

  return resolved;
}
