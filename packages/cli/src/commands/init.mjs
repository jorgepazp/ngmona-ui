import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import * as p from '@clack/prompts';
import { buildTheme, renderThemeColorsBlock, ROLES } from '@ngmona-ui/color';
import { DEFAULT_SEEDS } from '../lib/default-seeds.js';
import { createConfig, writeConfig, readConfig } from '../lib/config.js';
import { PREFIX_PATTERN } from '../lib/prefix/token.js';
import { prefixThemeReferences } from '../lib/prefix/theme.js';

/** @param {{ cwd: string, packageRoot: string, yes: boolean, prefix?: string }} ctx */
export async function initCommand(ctx) {
  const { cwd, packageRoot } = ctx;
  p.intro('ngmona-ui init');

  const existingConfig = readConfig(cwd);
  // Reinitializing keeps a previously configured prefix unless --prefix overrides it.
  const prefix = ctx.prefix ?? existingConfig?.tailwind?.prefix;
  if (prefix && !PREFIX_PATTERN.test(prefix)) {
    p.cancel(`Invalid Tailwind prefix "${prefix}" — Tailwind v4 prefixes are lowercase letters only (e.g. "tw").`);
    return;
  }

  if (existingConfig) {
    const proceed = ctx.yes || (await p.confirm({ message: 'ngmona.json already exists — reinitialize?', initialValue: false }));
    if (p.isCancel(proceed) || !proceed) {
      p.cancel('Aborted.');
      return;
    }
  }

  const seeds = {};
  for (const role of ROLES) {
    if (ctx.yes) {
      seeds[role] = DEFAULT_SEEDS[role];
      continue;
    }
    const value = await p.text({
      message: `Seed color for "${role}"`,
      placeholder: DEFAULT_SEEDS[role],
      defaultValue: DEFAULT_SEEDS[role],
    });
    if (p.isCancel(value)) {
      p.cancel('Aborted.');
      return;
    }
    seeds[role] = value || DEFAULT_SEEDS[role];
  }

  let stylesheetPath = 'src/styles.css';
  let componentsPath = 'src/app/ui';
  if (!ctx.yes) {
    const stylesheetAnswer = await p.text({ message: 'Path to your global stylesheet', defaultValue: stylesheetPath });
    if (p.isCancel(stylesheetAnswer)) {
      p.cancel('Aborted.');
      return;
    }
    stylesheetPath = stylesheetAnswer || stylesheetPath;

    const componentsAnswer = await p.text({
      message: 'Where should components be installed?',
      defaultValue: componentsPath,
    });
    if (p.isCancel(componentsAnswer)) {
      p.cancel('Aborted.');
      return;
    }
    componentsPath = componentsAnswer || componentsPath;
  }

  const themeCssPath = join(dirname(stylesheetPath), 'styles', 'ngmona-theme.css').replace(/\\/g, '/');
  const tokensCssPath = join(dirname(stylesheetPath), 'styles', 'ngmona-tokens.css').replace(/\\/g, '/');

  const spin = p.spinner();
  spin.start('Generating theme');
  const theme = buildTheme(seeds);
  const themeCss = prefixThemeReferences(
    renderThemeColorsBlock(theme, ROLES, 'run `ngmona theme` to change your brand colors.'),
    prefix,
  );

  const themeCssAbs = join(cwd, themeCssPath);
  mkdirSync(dirname(themeCssAbs), { recursive: true });
  writeFileSync(themeCssAbs, themeCss, 'utf8');

  // Radius, letter spacing, typography scale, font weights, shadows — everything that isn't a
  // color and so doesn't depend on a seed. Written once here, never rewritten by `ngmona theme`.
  const tokensCss = prefixThemeReferences(readFileSync(join(packageRoot, 'templates', 'base-tokens.css'), 'utf8'), prefix);
  const tokensCssAbs = join(cwd, tokensCssPath);
  mkdirSync(dirname(tokensCssAbs), { recursive: true });
  writeFileSync(tokensCssAbs, tokensCss, 'utf8');

  // Only the theme and token files are imported here, never `@import 'tailwindcss'` itself: that
  // stays the consumer's own line, which is also where a prefix has to be declared (prefix(tw)).
  const stylesheetAbs = join(cwd, stylesheetPath);
  const importLines = [
    `@import '${relativeImport(stylesheetPath, themeCssPath)}';`,
    `@import '${relativeImport(stylesheetPath, tokensCssPath)}';`,
  ];
  if (existsSync(stylesheetAbs)) {
    const existing = readFileSync(stylesheetAbs, 'utf8');
    const missing = importLines.filter((line) => !existing.includes(line));
    if (missing.length) {
      writeFileSync(stylesheetAbs, `${missing.join('\n')}\n${existing}`, 'utf8');
    }
  } else {
    mkdirSync(dirname(stylesheetAbs), { recursive: true });
    writeFileSync(stylesheetAbs, `${importLines.join('\n')}\n`, 'utf8');
  }

  mkdirSync(join(cwd, componentsPath), { recursive: true });

  if (prefix) warnIfPrefixNotDeclared(stylesheetAbs, stylesheetPath, prefix);

  const config = createConfig({ themeCssPath, tokensCssPath, stylesheetPath, componentsPath, seeds, prefix });
  writeConfig(cwd, config);
  spin.stop('Theme generated');

  p.outro(`Done. Wrote ${themeCssPath} and ${tokensCssPath}, updated ${stylesheetPath}, and created ngmona.json.`);
}

function warnIfPrefixNotDeclared(stylesheetAbs, stylesheetPath, prefix) {
  const css = readFileSync(stylesheetAbs, 'utf8');
  const tailwindImport = /@import\s+['"]tailwindcss['"][^;]*;/.exec(css)?.[0];
  if (!tailwindImport) {
    p.log.warn(
      `${stylesheetPath} has no @import 'tailwindcss' — make sure the stylesheet that imports Tailwind ` +
        `declares the prefix: @import 'tailwindcss' prefix(${prefix});`,
    );
  } else if (!new RegExp(`prefix\\(\\s*${prefix}\\s*\\)`).test(tailwindImport)) {
    p.log.warn(`${stylesheetPath} imports Tailwind without prefix(${prefix}) — change it to: @import 'tailwindcss' prefix(${prefix});`);
  }
}

function relativeImport(fromFile, toFile) {
  // Both paths are project-relative with forward slashes; compute a same-directory-tree-relative
  // import specifier since consumers may import stylesheets by path, not alias.
  const fromDir = dirname(fromFile);
  if (fromDir === '.') return `./${toFile}`;
  const fromParts = fromDir.split('/');
  const toParts = toFile.split('/');
  let i = 0;
  while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) i++;
  const up = fromParts.slice(i).map(() => '..');
  const down = toParts.slice(i);
  const result = [...up, ...down].join('/');
  return result.startsWith('.') ? result : `./${result}`;
}
