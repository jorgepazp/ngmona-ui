import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as p from '@clack/prompts';

/**
 * Components now use Tailwind's standard scales: `--spacing: 0.25rem` (every
 * spacing number doubled compared to the old 8px base) and Tailwind's font-weight names
 * (`font-semibold` where it used to say `font-medium`). A tokens file written by an older
 * `ngmona init` still carries the old values, so freshly added/updated components would render
 * at twice the size. The tokens file is the consumer's to edit, so this only explains the fix.
 *
 * @returns {string[]} the fixes the tokens file needs (empty when it is up to date)
 */
export function warnAboutLegacyTokens(cwd, config) {
  const file = config.tailwind?.tokensCss;
  const path = file && join(cwd, file);
  if (!path || !existsSync(path)) return [];
  const css = readFileSync(path, 'utf8');

  const problems = [];
  if (/--spacing:\s*8px\s*;/.test(css)) {
    problems.push('--spacing: 8px;  →  --spacing: 0.25rem;');
  }
  if (/--font-weight-medium:\s*600\s*;/.test(css) || /--font-weight-bold:\s*800\s*;/.test(css)) {
    problems.push(
      'font weights  →  Tailwind\'s scale: --font-weight-normal: 400; --font-weight-medium: 500; ' +
        '--font-weight-semibold: 600; --font-weight-bold: 700; --font-weight-extrabold: 800; (drop --font-weight-regular), ' +
        'and --text-*--font-weight: var(--font-weight-normal) → var(--font-weight-medium), 700 → var(--font-weight-bold)',
    );
  }
  if (problems.length === 0) return problems;

  p.log.warn(
    `${file} still uses the old ngmona scales, but components now use Tailwind's standard ones — ` +
      `they will render at the wrong size/weight until you update it:\n` +
      problems.map((line) => `  ${line}`).join('\n') +
      `\nIf your own templates use ngmona's spacing classes, double their numbers (py-1.5 → py-3) and rename ` +
      `font-medium → font-semibold, font-bold → font-extrabold, font-regular → font-normal.`,
  );
  return problems;
}
