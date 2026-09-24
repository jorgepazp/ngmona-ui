import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { buildTheme, renderThemeColorsBlock, ROLES } from '@ngmona-ui/color';
import { DEFAULT_SEEDS } from '../default-seeds.js';

/**
 * `tailwindcss` and `typescript` are loaded from the consumer's project (every Angular + Tailwind
 * v4 app already has both) rather than bundled into the CLI: TypeScript alone would add ~9 MB to
 * dist/bin.cjs, and matching the consumer's own Tailwind version is what we want anyway. Falls back
 * to the CLI's own resolution (useful when running from this repo).
 */
function requireFrom(bases, id) {
  let lastError;
  for (const base of bases) {
    try {
      return { mod: createRequire(join(base, 'noop.js'))(id), base };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export function loadTypeScript(cwd, packageRoot) {
  try {
    return requireFrom([cwd, packageRoot], 'typescript').mod;
  } catch {
    throw new Error('A Tailwind prefix is configured, but `typescript` could not be resolved from this project.');
  }
}

/**
 * Loads Tailwind's design system with ngmona's theme (colors + base tokens) so that project-specific
 * utilities like `text-label-lg` or `bg-surface-medium` are recognized.
 *
 * @returns {Promise<{ isUtility: (token: string) => boolean }>}
 */
export async function loadClassDetector({ cwd, packageRoot, config }) {
  const themeCss = [readThemeCss(cwd, config), readTokensCss(cwd, packageRoot, config)].join('\n');
  return loadDesignSystemDetector({ cwd, packageRoot, themeCss });
}

/**
 * Same, for an arbitrary set of `@theme` blocks (`themeCss` is appended after `@import 'tailwindcss'`).
 *
 * @returns {Promise<{ isUtility: (token: string) => boolean }>}
 */
export async function loadDesignSystemDetector({ cwd, packageRoot, themeCss }) {
  let tailwind;
  let tailwindRoot;
  try {
    const found = requireFrom([cwd, packageRoot], 'tailwindcss');
    tailwind = found.mod;
    tailwindRoot = dirname(createRequire(join(found.base, 'noop.js')).resolve('tailwindcss/package.json'));
  } catch {
    throw new Error('A Tailwind prefix is configured, but `tailwindcss` (v4) could not be resolved from this project.');
  }
  if (typeof tailwind.__unstable__loadDesignSystem !== 'function') {
    throw new Error('A Tailwind prefix requires Tailwind CSS v4 in this project.');
  }

  const design = await tailwind.__unstable__loadDesignSystem(`@import 'tailwindcss';\n${themeCss}`, {
    base: cwd,
    loadStylesheet: async (id, base) => {
      let path;
      if (id === 'tailwindcss') path = join(tailwindRoot, 'index.css');
      else if (id.startsWith('tailwindcss/')) path = join(tailwindRoot, id.slice('tailwindcss/'.length));
      else path = resolve(base, id);
      return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
    },
  });

  const cache = new Map();
  return {
    isUtility(token) {
      let known = cache.get(token);
      if (known === undefined) {
        known = design.candidatesToCss([token])[0] != null;
        cache.set(token, known);
      }
      return known;
    },
  };
}

function readThemeCss(cwd, config) {
  const path = config.tailwind?.themeCss && join(cwd, config.tailwind.themeCss);
  if (path && existsSync(path)) return readFileSync(path, 'utf8');
  const seeds = { ...DEFAULT_SEEDS, ...config.theme?.seeds };
  return renderThemeColorsBlock(buildTheme(seeds), ROLES, '');
}

function readTokensCss(cwd, packageRoot, config) {
  const path = config.tailwind?.tokensCss && join(cwd, config.tailwind.tokensCss);
  return readFileSync(path && existsSync(path) ? path : join(packageRoot, 'templates', 'base-tokens.css'), 'utf8');
}
