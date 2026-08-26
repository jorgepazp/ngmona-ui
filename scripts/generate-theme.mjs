#!/usr/bin/env node
// Regenerates src/styles/theme-colors.css from scripts/theme.seeds.json using @ngmona-ui/color.
// To change a brand color: edit theme.seeds.json, then run `npm run theme:generate`.
//
// Run: npm run theme:generate

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTheme, renderThemeColorsBlock, ROLES } from '@ngmona-ui/color';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEEDS_PATH = join(__dirname, 'theme.seeds.json');
const OUTPUT_PATH = join(__dirname, '..', 'src', 'styles', 'theme-colors.css');

function main() {
  const seeds = JSON.parse(readFileSync(SEEDS_PATH, 'utf8'));
  const theme = buildTheme(seeds);
  const css = renderThemeColorsBlock(theme, ROLES);
  writeFileSync(OUTPUT_PATH, css, 'utf8');
  console.log(`Generated ${OUTPUT_PATH} from ${SEEDS_PATH} (${ROLES.length} roles).`);
}

main();
