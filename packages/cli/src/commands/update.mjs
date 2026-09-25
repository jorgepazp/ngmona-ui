import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import * as p from '@clack/prompts';
import { loadRegistry, resolveWithDependencies, registrySourceDir } from '../lib/registry-loader.js';
import { hashContent, listFilesRecursive } from '../lib/fs-utils.js';
import { readConfig, writeConfig } from '../lib/config.js';
import { installPackages, readConsumerDependencyNames } from '../lib/pkg-manager.js';
import { createPrefixTransform, logPrefixReport, syncThemeFiles } from '../lib/prefix/index.js';
import { warnAboutLegacyTokens } from '../lib/legacy-tokens.js';

const SUMMARY_HEADINGS = {
  updated: 'Updated',
  unchanged: 'Already up to date',
  added: 'Added',
  removed: 'Removed (no longer in the registry)',
  conflicts: 'Conflicts — needs manual merge',
  skipped: 'Skipped',
};

/**
 * Brings already-installed components up to date with the current registry, without clobbering
 * edits the consumer made after installing.
 *
 * Every file `add` writes is tracked with the hash it had *at install time*
 * (`installed[name].files[].hash`, see add.mjs) — that's the three-way-merge base. Comparing it
 * against the file's current on-disk hash says whether the consumer touched it since; comparing it
 * against the registry's current hash says whether upstream changed it. That gives four cases:
 *
 *   - registry unchanged                          -> nothing to do, regardless of local edits.
 *   - registry changed, consumer never touched it  -> safe to overwrite in place.
 *   - registry changed, consumer also changed it   -> conflict: never overwrite a local edit
 *     silently. The incoming version is written to `<file>.new` next to it instead, for the
 *     consumer to merge by hand — the same `.orig`/`.rej`-style pattern other config-file
 *     updaters (Composer, Create React App's `eject`-avoidant tooling) use, since a generic
 *     line-based 3-way auto-merge is too easy to get subtly wrong for component source.
 *   - the file no longer exists locally            -> the consumer deleted it; leave it deleted.
 *
 * Files the registry added since install are created outright (nothing to compare against). Files
 * the registry dropped are deleted only if the local copy is still unmodified — one that was
 * edited and is now slated for removal is left in place, with a warning, and stays tracked so it
 * keeps surfacing on future updates until the consumer deals with it.
 *
 * `registryDependencies` are re-resolved on every run (same as `add`), so a component that started
 * depending on something new since install gets it installed automatically.
 *
 * @param {{ cwd: string, packageRoot: string, names: string[], yes: boolean, dryRun: boolean }} ctx
 */
export async function updateCommand(ctx) {
  const { cwd, packageRoot, names, yes, dryRun } = ctx;
  p.intro('ngmona-ui update');

  const config = readConfig(cwd);
  if (!config) {
    p.cancel('No ngmona.json found — run `ngmona init` first.');
    return;
  }

  const installedNames = new Set(Object.keys(config.installed ?? {}));
  if (installedNames.size === 0) {
    p.cancel('Nothing installed yet — run `ngmona add <component>` first.');
    return;
  }

  const requested = [];
  for (const name of names.length ? names : [...installedNames]) {
    const key = name.toLowerCase();
    if (installedNames.has(key)) {
      requested.push(key);
    } else {
      p.log.error(`"${name}" isn't installed — run \`ngmona add ${name}\` instead of update.`);
    }
  }
  if (requested.length === 0) {
    p.cancel('Nothing to update.');
    return;
  }

  const registry = loadRegistry(packageRoot);
  const { resolved, missing } = resolveWithDependencies(registry, requested);
  if (missing.length) {
    p.log.error(`No longer in the registry (removed upstream?): ${missing.join(', ')}`);
  }

  const newDeps = resolved.filter((e) => !installedNames.has(e.name.toLowerCase()));
  if (newDeps.length) {
    p.log.info(`Also installing new dependencies: ${newDeps.map((e) => e.name).join(', ')}`);
  }

  // With a Tailwind prefix, "the registry's version" of a file means its prefixed rewrite — that's
  // what `add` wrote and hashed, so it's what every comparison below has to use too.
  let prefixTransform;
  try {
    prefixTransform = await createPrefixTransform({ cwd, packageRoot, config });
  } catch (error) {
    p.cancel(error.message);
    return;
  }

  const destRoot = join(cwd, config.aliases.components);
  const installedUpdate = { ...config.installed };
  const allNpmDeps = new Set();
  const summary = { updated: [], unchanged: [], added: [], removed: [], conflicts: [], skipped: [] };

  for (const entry of resolved) {
    const srcDir = registrySourceDir(packageRoot, entry.name);
    const destDir = join(destRoot, entry.name);
    const isNewComponent = !installedNames.has(entry.name.toLowerCase());
    const previous = config.installed[entry.name] ?? { files: [] };
    const baseHashByPath = new Map(previous.files.map((f) => [f.path, f.hash]));

    const registryFiles = listFilesRecursive(srcDir);
    const nextFiles = [];

    for (const relPath of registryFiles) {
      const srcPath = join(srcDir, relPath);
      const destPath = join(destDir, relPath);
      const rawContent = readFileSync(srcPath);
      const newContent = prefixTransform ? prefixTransform.transform(`${entry.name}/${relPath}`, rawContent) : rawContent;
      const newHash = hashContent(newContent);
      const baseHash = baseHashByPath.get(relPath);
      const localExists = existsSync(destPath);
      const localHash = localExists ? hashContent(readFileSync(destPath)) : null;

      let action;
      if (isNewComponent || baseHash === undefined) {
        // Never tracked before: a brand-new dependency, or a file the registry added since
        // install. If something already happens to sit at that path we don't recognize it, so
        // don't guess — treat it like any other conflict instead of silently overwriting it.
        action = localExists ? 'conflict' : 'add';
      } else if (newHash === baseHash) {
        action = 'unchanged';
      } else if (!localExists) {
        action = 'local-deleted'; // consumer removed it; respect that instead of resurrecting it.
      } else if (localHash === baseHash) {
        action = 'update'; // untouched locally, registry moved on -> safe to overwrite.
      } else {
        action = 'conflict'; // both sides changed since install.
      }

      if (!dryRun) {
        if (action === 'add' || action === 'update' || (action === 'conflict' && yes)) {
          mkdirSync(dirname(destPath), { recursive: true });
          writeFileSync(destPath, newContent);
          // Clean up a stale .new left by an earlier, non-forced run over the same conflict.
          if (existsSync(`${destPath}.new`)) rmSync(`${destPath}.new`);
        } else if (action === 'conflict') {
          mkdirSync(dirname(destPath), { recursive: true });
          writeFileSync(`${destPath}.new`, newContent);
        }
      }

      if (action !== 'local-deleted') {
        // Conflicts we didn't force keep the OLD base hash, so the next run still detects the
        // same divergence instead of quietly considering it resolved.
        const trackedHash = action === 'conflict' && !yes ? baseHash : newHash;
        nextFiles.push({ path: relPath, hash: trackedHash });
      }

      const label = `${entry.name}/${relPath}`;
      if (action === 'unchanged') summary.unchanged.push(label);
      else if (action === 'add') summary.added.push(label);
      else if (action === 'update') summary.updated.push(label);
      else if (action === 'local-deleted') summary.skipped.push(`${label} (deleted locally — left as-is)`);
      else if (action === 'conflict' && yes) summary.updated.push(`${label} (local edits overwritten, --yes)`);
      else summary.conflicts.push(`${label} -> wrote ${relPath}.new next to it for manual merge`);
    }

    // Files this component used to ship that the registry no longer has: delete only if the local
    // copy still matches its install-time hash (the consumer never touched it). An edited file
    // slated for removal is left alone — and stays tracked, so it keeps surfacing.
    const currentPaths = new Set(registryFiles);
    for (const old of previous.files) {
      if (currentPaths.has(old.path)) continue;
      const destPath = join(destDir, old.path);
      const label = `${entry.name}/${old.path}`;
      if (!existsSync(destPath)) continue; // already gone
      const localHash = hashContent(readFileSync(destPath));
      if (localHash === old.hash) {
        if (!dryRun) rmSync(destPath);
        summary.removed.push(label);
      } else {
        nextFiles.push(old);
        summary.skipped.push(`${label} (upstream removed this file, but it's been edited locally — left in place)`);
      }
    }

    if (!dryRun) {
      installedUpdate[entry.name] = { version: registry.version, files: nextFiles };
    }
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

  for (const [key, items] of Object.entries(summary)) {
    if (items.length === 0) continue;
    const text = `${SUMMARY_HEADINGS[key]}:\n${items.map((i) => `  ${i}`).join('\n')}`;
    if (key === 'conflicts') p.log.warn(text);
    else p.log.info(text);
  }

  if (summary.conflicts.length) {
    p.log.warn(
      `${summary.conflicts.length} file(s) have local edits that overlap with an upstream change.\n` +
        `Review the *.new file next to each one, merge by hand, then delete the *.new — or rerun ` +
        `with --yes to accept upstream and discard the local edits instead.`,
    );
  }

  p.outro(
    dryRun
      ? 'Dry run: no files were written.'
      : summary.updated.length || summary.added.length || summary.removed.length || summary.conflicts.length
        ? 'Update complete.'
        : 'Already up to date.',
  );
}
