#!/usr/bin/env node
// Extracts the brand agnostic @theme block from ui-kit's own src/styles.css (white/black,
// radius, letter spacing, typography, font weights, fonts, shadows) into a static template the
// CLI bundles and `ngmona init` copies into a consumer project. Colors live in a separate,
// per-consumer generated file (see @ngmona-ui/color) since they depend on seed input; these
// tokens don't, so a plain extracted copy is enough.
//
// Run: node scripts/build-base-tokens.mjs (also runs as part of `npm run build`)

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STYLES_PATH = join(__dirname, '..', '..', '..', 'src', 'styles.css');
const OUT_PATH = join(__dirname, '..', 'templates', 'base-tokens.css');

function extractThemeBlock(source) {
  const start = source.indexOf('@theme {');
  if (start === -1) {
    throw new Error('Could not find "@theme {" in src/styles.css');
  }
  const bodyStart = start + '@theme {'.length;
  const end = source.indexOf('\n}', bodyStart);
  if (end === -1) {
    throw new Error('Could not find the closing "}" of the @theme block in src/styles.css');
  }
  // Drop the leading blank line right after `@theme {` and trailing whitespace before `}`, but
  // keep every line's own indentation intact (a plain .trim() would eat the first line's indent).
  return source
    .slice(bodyStart, end)
    .replace(/^\n/, '')
    .replace(/\s+$/, '');
}

function main() {
  const source = readFileSync(STYLES_PATH, 'utf8');
  const body = extractThemeBlock(source);

  const output = `/*
 * GENERATED FILE — extracted from ui-kit's own src/styles.css by
 * packages/cli/scripts/build-base-tokens.mjs. Written once by \`ngmona init\`, never rewritten by
 * any other command (unlike the color theme file, these tokens don't depend on a seed) — treat
 * this as a starting point and hand-edit freely after install.
 */
@theme static {
${body}
}
`;

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, output, 'utf8');
  console.log(`Extracted base tokens from ${STYLES_PATH} to ${OUT_PATH}.`);
}

main();
