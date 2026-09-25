import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { initCommand } from './commands/init.mjs';
import { addCommand } from './commands/add.mjs';
import { updateCommand } from './commands/update.mjs';
import { listCommand } from './commands/list.mjs';
import { themeCommand } from './commands/theme.mjs';
import { ROLES } from '@ngmona-ui/color';

// Works whether run from source (src/bin.mjs, ESM, `import.meta.url` available) or the
// esbuild-bundled CJS artifact (dist/bin.cjs, where esbuild shims `__dirname` instead — see
// scripts/bundle.mjs for why the bundle targets CJS). Both `src/` and `dist/` sit exactly one
// level under the package root, so either way it's two `dirname()` calls up from this file.
// eslint-disable-next-line no-undef
const currentDir = typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url));
const packageRoot = dirname(currentDir);
const { version } = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));

const program = new Command();
program.name('ngmona').description('CLI for ngmona UI').version(version);

program
  .command('init')
  .description('Initialize a theme in the current project')
  .option('-y, --yes', 'skip prompts, use defaults', false)
  .option('--prefix <prefix>', 'Tailwind class prefix your project uses (e.g. "tw" for prefix(tw)); components are rewritten to use it')
  .action((opts) => initCommand({ cwd: process.cwd(), packageRoot, yes: opts.yes, prefix: opts.prefix }));

program
  .command('add')
  .description('Add one or more components to the current project')
  .argument('<components...>', 'component names, e.g. button dropdown-menu')
  .option('-y, --yes', 'overwrite existing files without prompting', false)
  .option('--dry-run', 'show what would happen without writing anything', false)
  .action((components, opts) =>
    addCommand({ cwd: process.cwd(), packageRoot, names: components, yes: opts.yes, dryRun: opts.dryRun }),
  );

program
  .command('update')
  .description('Update installed components to match the current registry, without overwriting local edits')
  .argument('[components...]', 'component names to update (defaults to everything installed)', [])
  .option('-y, --yes', 'also overwrite files with local edits, discarding those edits', false)
  .option('--dry-run', 'show what would happen without writing anything', false)
  .action((components, opts) =>
    updateCommand({ cwd: process.cwd(), packageRoot, names: components, yes: opts.yes, dryRun: opts.dryRun }),
  );

program
  .command('list')
  .description('List available components')
  .option('--installed', 'only show installed components', false)
  .action((opts) => listCommand({ cwd: process.cwd(), packageRoot, installedOnly: opts.installed }));

const themeCmd = program.command('theme').description('Update brand colors and regenerate the theme');
for (const role of ROLES) {
  themeCmd.option(`--${role} <color>`, `seed color for "${role}"`);
}
themeCmd.action((opts) => themeCommand({ cwd: process.cwd(), flags: opts }));

program.parseAsync(process.argv);
