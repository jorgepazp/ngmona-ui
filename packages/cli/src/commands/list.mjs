import { loadRegistry } from '../lib/registry-loader.js';
import { readConfig } from '../lib/config.js';

/** @param {{ cwd: string, packageRoot: string, installedOnly: boolean }} ctx */
export function listCommand(ctx) {
  const registry = loadRegistry(ctx.packageRoot);
  const config = readConfig(ctx.cwd);
  const installedNames = new Set(Object.keys(config?.installed ?? {}));

  const components = registry.components
    .filter((c) => c.type === 'component')
    .filter((c) => !ctx.installedOnly || installedNames.has(c.name));

  if (components.length === 0) {
    console.log('No components found.');
    return;
  }

  const nameWidth = Math.max(...components.map((c) => c.name.length), 4);
  const categoryWidth = Math.max(...components.map((c) => c.category.length), 8);

  console.log(`${'NAME'.padEnd(nameWidth)}  ${'CATEGORY'.padEnd(categoryWidth)}  INSTALLED  DESCRIPTION`);
  for (const c of components) {
    const installed = installedNames.has(c.name) ? 'yes' : '';
    const description = (c.description || '').slice(0, 60);
    console.log(`${c.name.padEnd(nameWidth)}  ${c.category.padEnd(categoryWidth)}  ${installed.padEnd(9)}  ${description}`);
  }
  console.log(`\n${components.length} component(s).`);
}
