import { join } from 'node:path';
import * as p from '@clack/prompts';
import { loadRegistry, resolveWithDependencies, registrySourceDir } from '../lib/registry-loader.js';
import { copyEntry } from '../lib/fs-utils.js';
import { readConfig, writeConfig } from '../lib/config.js';
import { installPackages, readConsumerDependencyNames } from '../lib/pkg-manager.js';
import { createPrefixTransform, logPrefixReport, syncThemeFiles } from '../lib/prefix/index.js';
import { warnAboutLegacyTokens } from '../lib/legacy-tokens.js';

/**
 * @param {{ cwd: string, packageRoot: string, names: string[], yes: boolean, dryRun: boolean }} ctx
 * @returns {Promise<{ results: Record<string, object[]>, prefixReports?: Map<string, { changes: object[], flags: object[] }> } | undefined>}
 */
export async function addCommand(ctx) {
  const { cwd, packageRoot, names, yes, dryRun } = ctx;
  p.intro('ngmona-ui add');

  const config = readConfig(cwd);
  if (!config) {
    p.cancel('No ngmona.json found — run `ngmona init` first.');
    return;
  }

  if (names.length === 0) {
    p.cancel('Specify at least one component name, e.g. `ngmona add button`.');
    return;
  }

  const registry = loadRegistry(packageRoot);
  const { resolved, missing } = resolveWithDependencies(registry, names);

  if (missing.length) {
    p.log.error(`Unknown component(s): ${missing.join(', ')}`);
  }
  if (resolved.length === 0) {
    p.cancel('Nothing to install.');
    return;
  }

  const requestedSet = new Set(names.map((n) => n.toLowerCase()));
  const extra = resolved.filter((e) => !requestedSet.has(e.name.toLowerCase()));
  if (extra.length) {
    p.log.info(`Also installing dependencies: ${extra.map((e) => e.name).join(', ')}`);
  }

  let prefixTransform;
  try {
    prefixTransform = await createPrefixTransform({ cwd, packageRoot, config });
  } catch (error) {
    p.cancel(error.message);
    return;
  }

  const destRoot = join(cwd, config.aliases.components);
  const allNpmDeps = new Set();
  const installedUpdate = { ...config.installed };
  const resultsByEntry = {};

  for (const entry of resolved) {
    const srcDir = registrySourceDir(packageRoot, entry.name);
    const destDir = join(destRoot, entry.name);

    let askedOverwriteAll = null;
    const results = copyEntry(srcDir, destDir, {
      dryRun,
      transform: prefixTransform && ((relPath, content) => prefixTransform.transform(`${entry.name}/${relPath}`, content)),
      onConflict: (relPath) => {
        if (yes) return true;
        if (askedOverwriteAll !== null) return askedOverwriteAll;
        return false; // non-interactive default: skip existing, unmodified files (see log below)
      },
    });

    resultsByEntry[entry.name] = results;
    for (const r of results) {
      if (r.action === 'skipped') {
        p.log.warn(`${entry.name}/${r.path} already exists and differs — skipped (use --yes to overwrite).`);
      }
    }

    installedUpdate[entry.name] = {
      version: registry.version,
      files: results.filter((r) => r.action !== 'skipped').map((r) => ({ path: r.path, hash: r.hash })),
    };

    for (const dep of entry.npmDependencies) allNpmDeps.add(dep);
  }

  warnAboutLegacyTokens(cwd, config);
  if (prefixTransform) logPrefixReport(prefixTransform, { detailed: dryRun });
  if (prefixTransform) syncThemeFiles({ cwd, config, prefix: prefixTransform.prefix, dryRun });

  const consumerDeps = readConsumerDependencyNames(cwd);
  const missingNpmDeps = [...allNpmDeps].filter((dep) => !consumerDeps.has(dep));

  if (missingNpmDeps.length) {
    p.log.step(`Installing npm dependencies: ${missingNpmDeps.join(', ')}`);
    const result = installPackages(cwd, missingNpmDeps, { dryRun });
    if (!result.ok) {
      p.log.error(`${result.manager} install failed — install manually: ${missingNpmDeps.join(', ')}`);
    }
  }

  if (!dryRun) {
    writeConfig(cwd, { ...config, installed: installedUpdate });
  }

  p.outro(
    dryRun
      ? `Dry run: would install ${resolved.map((e) => e.name).join(', ')}.`
      : `Installed: ${resolved.map((e) => e.name).join(', ')}.`,
  );

  return { results: resultsByEntry, prefixReports: prefixTransform?.reports };
}
