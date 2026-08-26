#!/usr/bin/env node
// Builds registry.json + a copy of every component's source under ./registry/<name>/, read by
// the CLI's `add`/`list` commands at runtime. Reuses ui-kit's own component-scanner.mjs (the same
// module generate-api-docs.mjs uses) so component metadata never has two separate parsers.
//
// Run: npm run build:registry (from packages/cli), or as part of `npm run build`.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseComponentFile, extractImportSpecifiers } from '../../../scripts/lib/component-scanner.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_ROOT = join(__dirname, '..', '..', '..', 'src', 'app', 'registry');
const OUT_DIR = join(__dirname, '..', 'registry');
const OUT_MANIFEST = join(__dirname, '..', 'registry.json');
const CLI_PACKAGE_JSON = join(__dirname, '..', 'package.json');

// Assumed already present in any Angular project this CLI targets — never recorded as an
// npmDependency to install.
const BASELINE_NPM_PACKAGES = new Set([
  '@angular/core',
  '@angular/common',
  '@angular/forms',
  '@angular/router',
  '@angular/platform-browser',
  'rxjs',
  'tslib',
]);

const CATEGORY_MAP = {
  accordion: 'layout',
  alert: 'feedback',
  'alert-dialog': 'overlay',
  autocomplete: 'form',
  avatar: 'data-display',
  badge: 'feedback',
  breadcrumb: 'navigation',
  button: 'action',
  calendar: 'form',
  card: 'layout',
  checkbox: 'form',
  combobox: 'form',
  command: 'overlay',
  'data-table': 'data-display',
  drawer: 'overlay',
  'dropdown-menu': 'overlay',
  'file-upload': 'form',
  input: 'form',
  'input-group': 'form',
  label: 'form',
  link: 'navigation',
  modal: 'overlay',
  notification: 'feedback',
  'number-input': 'form',
  paginator: 'navigation',
  popover: 'overlay',
  progress: 'feedback',
  questionnaire: 'form',
  radio: 'form',
  'radio-group': 'form',
  resizable: 'layout',
  'search-input': 'form',
  select: 'form',
  separator: 'layout',
  sidebar: 'navigation',
  skeleton: 'feedback',
  slider: 'form',
  spinner: 'feedback',
  stepper: 'layout',
  table: 'data-display',
  tabs: 'layout',
  textarea: 'form',
  timeline: 'data-display',
  toast: 'feedback',
  toggle: 'form',
  tooltip: 'overlay',
  'url-copy': 'data-display',
};

function toPackageName(specifier) {
  const parts = specifier.split('/');
  return specifier.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];
}

/** All files belonging to a top-level registry entry (component or `shared`), relative to its own dir. */
function collectEntryFiles(entryDir) {
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (name.endsWith('.api.ts') || name.endsWith('.spec.ts')) continue;
      files.push(full);
    }
  };
  walk(entryDir);
  return files;
}

function classifyFile(path) {
  return path.endsWith('.html') ? 'template' : 'component';
}

function buildEntry(entryName, entryDir, allEntryNames) {
  const absoluteFiles = collectEntryFiles(entryDir);
  const files = absoluteFiles.map((absPath) => ({
    path: relative(entryDir, absPath).replace(/\\/g, '/'),
    type: classifyFile(absPath),
  }));

  const registryDependencies = new Set();
  const npmDependencies = new Set();

  for (const absPath of absoluteFiles) {
    if (!absPath.endsWith('.ts')) continue;
    for (const specifier of extractImportSpecifiers(absPath)) {
      if (specifier.startsWith('.')) {
        // Resolve relative to REGISTRY_ROOT to find which top-level entry it points into.
        const resolved = join(dirname(absPath), specifier);
        const relToRoot = relative(REGISTRY_ROOT, resolved).replace(/\\/g, '/');
        const otherEntry = relToRoot.split('/')[0];
        if (otherEntry && otherEntry !== entryName && allEntryNames.has(otherEntry)) {
          registryDependencies.add(otherEntry);
        }
        continue;
      }
      const pkg = toPackageName(specifier);
      if (!BASELINE_NPM_PACKAGES.has(pkg)) {
        npmDependencies.add(pkg);
      }
    }
  }

  // Primary file convention: <entry>/<entry>.ts (e.g. registry/button/button.ts). Subcomponents
  // (e.g. accordion/accordion-item/) are included in `files` but don't get their own entry.
  // A few entries (e.g. `toast/`, whose @Component class is `Toaster` in toaster.ts, alongside a
  // non-component toast.service.ts) don't follow that convention — fall back to the first
  // top-level .ts file that actually declares an @Component class.
  let primaryFile = join(entryDir, `${entryName}.ts`);
  if (!existsSync(primaryFile)) {
    const topLevelTsFiles = readdirSync(entryDir)
      .filter((f) => f.endsWith('.ts') && !f.endsWith('.api.ts') && !f.endsWith('.spec.ts') && !f.endsWith('.type.ts'))
      .map((f) => join(entryDir, f));
    primaryFile = topLevelTsFiles.find((f) => /@Component\(/.test(readFileSync(f, 'utf8'))) ?? topLevelTsFiles[0];
  }

  let description = '';
  let api;
  if (primaryFile && existsSync(primaryFile)) {
    const parsed = parseComponentFile(primaryFile);
    if (parsed) {
      description = parsed.description;
      api = { name: parsed.className, description: parsed.description, props: parsed.props };
    }
  }

  const isShared = entryName === 'shared';
  return {
    name: entryName,
    type: isShared ? 'lib' : 'component',
    category: isShared ? 'internal' : (CATEGORY_MAP[entryName] ?? 'general'),
    description,
    files,
    registryDependencies: [...registryDependencies].sort(),
    npmDependencies: [...npmDependencies].sort(),
    ...(api ? { api } : {}),
  };
}

function copyEntryFiles(entryName, entryDir) {
  const destRoot = join(OUT_DIR, entryName);
  const files = collectEntryFiles(entryDir);
  for (const absPath of files) {
    const relPath = relative(entryDir, absPath);
    const destPath = join(destRoot, relPath);
    mkdirSync(dirname(destPath), { recursive: true });
    copyFileSync(absPath, destPath);
  }
}

function main() {
  const entryNames = readdirSync(REGISTRY_ROOT).filter((name) => statSync(join(REGISTRY_ROOT, name)).isDirectory());
  const allEntryNames = new Set(entryNames);

  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const components = [];
  for (const entryName of entryNames) {
    const entryDir = join(REGISTRY_ROOT, entryName);
    components.push(buildEntry(entryName, entryDir, allEntryNames));
    copyEntryFiles(entryName, entryDir);
  }

  components.sort((a, b) => a.name.localeCompare(b.name));

  const cliVersion = JSON.parse(readFileSync(CLI_PACKAGE_JSON, 'utf8')).version;
  const manifest = { name: 'ngmona-ui', version: cliVersion, components };

  writeFileSync(OUT_MANIFEST, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`Built registry.json with ${components.length} entries, source copied to ${OUT_DIR}.`);
}

main();
