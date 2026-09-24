import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';
import { initCommand } from '../../src/commands/init.mjs';
import { addCommand } from '../../src/commands/add.mjs';
import { loadRegistry } from '../../src/lib/registry-loader.js';
import { listFilesRecursive } from '../../src/lib/fs-utils.js';

export const PACKAGE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
/** Inside the repo (not os.tmpdir()) so `tailwindcss`/`typescript` resolve from the fixtures. */
const FIXTURES_ROOT = join(PACKAGE_ROOT, '.test-fixtures');

export const STYLESHEET = 'src/styles.css';
export const COMPONENTS_DIR = 'src/app/ui';

export function allComponentNames() {
  return loadRegistry(PACKAGE_ROOT).components.map((c) => c.name);
}

/**
 * A minimal consumer project: a package.json already listing every npm dependency the registry
 * needs (so `add` never shells out to a package manager) and a global stylesheet with its own
 * Tailwind import — carrying `prefix(<prefix>)` when a prefix is set, like a real prefixed app.
 */
export async function createFixture(name, { prefix } = {}) {
  const cwd = join(FIXTURES_ROOT, name);
  rmSync(cwd, { recursive: true, force: true });
  mkdirSync(join(cwd, 'src'), { recursive: true });

  const npmDeps = new Set(loadRegistry(PACKAGE_ROOT).components.flatMap((c) => c.npmDependencies));
  const dependencies = Object.fromEntries([...npmDeps].map((d) => [d, '*']));
  writeFileSync(join(cwd, 'package.json'), JSON.stringify({ name, private: true, dependencies }, null, 2));

  const tailwindImport = prefix ? `@import 'tailwindcss' prefix(${prefix}) source(none);` : `@import 'tailwindcss' source(none);`;
  writeFileSync(join(cwd, STYLESHEET), `${tailwindImport}\n`);

  await initCommand({ cwd, packageRoot: PACKAGE_ROOT, yes: true, prefix });
  return cwd;
}

export async function addAll(cwd, { yes = true, dryRun = false } = {}) {
  return addCommand({ cwd, packageRoot: PACKAGE_ROOT, names: allComponentNames(), yes, dryRun });
}

/** Every installed file's contents, keyed by path relative to the components directory. */
export function snapshotComponents(cwd) {
  const root = join(cwd, COMPONENTS_DIR);
  return Object.fromEntries(listFilesRecursive(root).map((f) => [f, readFileSync(join(root, f), 'utf8')]));
}

/**
 * Compiles `css` (resolved relative to the fixture's stylesheet) against the candidates Tailwind's
 * own scanner (oxide) extracts from the installed component files — the same thing the consumer's
 * build would do.
 */
export async function compileComponents(cwd, css, { files } = {}) {
  const base = dirname(join(cwd, STYLESHEET));
  const compiler = await compile(css, { base, onDependency: () => {} });
  const scanner = new Scanner({});
  const contents = files ?? snapshotComponents(cwd);
  const candidates = scanner.scanFiles(
    Object.entries(contents).map(([file, content]) => ({ content, extension: file.split('.').pop() })),
  );
  return { css: compiler.build(candidates), candidates, compiler };
}

export function readStylesheet(cwd) {
  return readFileSync(join(cwd, STYLESHEET), 'utf8');
}

/** Where Tailwind's scanner finds each candidate in each file: `[{ file, candidate, position }]`. */
export function candidatePositions(files) {
  const scanner = new Scanner({});
  return Object.entries(files).flatMap(([file, content]) =>
    scanner
      .getCandidatesWithPositions({ content, extension: file.split('.').pop() })
      .map(({ candidate, position }) => ({ file, candidate, position })),
  );
}
