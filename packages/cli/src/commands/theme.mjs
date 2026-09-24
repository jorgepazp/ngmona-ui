import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as p from '@clack/prompts';
import { buildTheme, renderThemeColorsBlock, ROLES } from '@ngmona-ui/color';
import { readConfig, writeConfig } from '../lib/config.js';
import { configuredPrefix } from '../lib/prefix/index.js';
import { prefixThemeReferences } from '../lib/prefix/theme.js';

/** @param {{ cwd: string, flags: Partial<Record<string,string>> }} ctx */
export async function themeCommand(ctx) {
  const { cwd, flags } = ctx;
  p.intro('ngmona-ui theme');

  const config = readConfig(cwd);
  if (!config) {
    p.cancel('No ngmona.json found — run `ngmona init` first.');
    return;
  }

  const seeds = { ...config.theme.seeds };
  const flagged = ROLES.filter((role) => flags[role]);

  if (flagged.length > 0) {
    for (const role of flagged) seeds[role] = flags[role];
  } else {
    for (const role of ROLES) {
      const value = await p.text({ message: `Seed color for "${role}"`, defaultValue: seeds[role] });
      if (p.isCancel(value)) {
        p.cancel('Aborted.');
        return;
      }
      seeds[role] = value || seeds[role];
    }
  }

  const spin = p.spinner();
  spin.start('Regenerating theme');
  const theme = buildTheme(seeds);
  const css = prefixThemeReferences(
    renderThemeColorsBlock(theme, ROLES, 'run `ngmona theme` to change your brand colors.'),
    configuredPrefix(config),
  );
  writeFileSync(join(cwd, config.tailwind.themeCss), css, 'utf8');
  writeConfig(cwd, { ...config, theme: { seeds } });
  spin.stop('Theme regenerated');

  p.outro(`Updated ${config.tailwind.themeCss}.`);
}
