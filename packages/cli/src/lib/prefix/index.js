import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as p from '@clack/prompts';
import { loadClassDetector, loadTypeScript } from './load-deps.js';
import { createPrefixer } from './rewrite.js';
import { prefixThemeReferences } from './theme.js';
import { PREFIX_PATTERN } from './token.js';

/** The configured Tailwind prefix (`ngmona.json` → `tailwind.prefix`), or null when unset. */
export function configuredPrefix(config) {
  const prefix = config.tailwind?.prefix;
  if (prefix === undefined || prefix === null || prefix === '') return null;
  if (typeof prefix !== 'string' || !PREFIX_PATTERN.test(prefix)) {
    throw new Error(`Invalid tailwind.prefix "${prefix}" in ngmona.json — Tailwind v4 prefixes are lowercase letters only (e.g. "tw").`);
  }
  return prefix;
}

/**
 * Builds the per-file transform `add`/`update` apply to registry source before writing it, or
 * returns null when no prefix is configured (files are then copied byte for byte, as before).
 * The transform is deterministic, so hashes of its output work as-is for update's three-way merge.
 *
 * @returns {Promise<null | { prefix: string, transform: (relPath: string, content: Buffer) => Buffer, reports: Map<string, { changes: object[], flags: object[] }> }>}
 */
export async function createPrefixTransform({ cwd, packageRoot, config }) {
  const prefix = configuredPrefix(config);
  if (!prefix) return null;

  const ts = loadTypeScript(cwd, packageRoot);
  const { isUtility } = await loadClassDetector({ cwd, packageRoot, config });
  const prefixer = createPrefixer({ prefix, isUtility, ts });
  const reports = new Map();

  return {
    prefix,
    reports,
    /** `label` identifies the file in reports, e.g. `button/button.html`. */
    transform(label, content) {
      if (!/\.(html|ts)$/.test(label)) return content;
      const result = prefixer.rewriteFile(label, content.toString('utf8'));
      reports.set(label, { changes: result.changes, flags: result.flags });
      return Buffer.from(result.content, 'utf8');
    },
  };
}

/**
 * The theme and token files `init` wrote before a prefix was configured still reference theme
 * variables by their unprefixed names (`var(--color-primary-300)`), which no longer exist once
 * Tailwind emits them as `--tw-color-primary-300`. Brings them in line; a no-op once they are.
 */
export function syncThemeFiles({ cwd, config, prefix, dryRun }) {
  for (const file of [config.tailwind?.themeCss, config.tailwind?.tokensCss]) {
    const path = file && join(cwd, file);
    if (!path || !existsSync(path)) continue;
    const css = readFileSync(path, 'utf8');
    const next = prefixThemeReferences(css, prefix);
    if (next === css) continue;
    if (!dryRun) writeFileSync(path, next, 'utf8');
    p.log.info(`${dryRun ? 'Would update' : 'Updated'} var() references in ${file} to the --${prefix}- names Tailwind emits with prefix(${prefix}).`);
  }
}

const SAMPLE_SIZE = 3;

/** Logs what the prefix transform did. `detailed` (dry runs) lists every rewritten file with a sample. */
export function logPrefixReport(prefixTransform, { detailed }) {
  const { prefix, reports } = prefixTransform;
  const rewritten = [...reports].filter(([, r]) => r.changes.length);
  const total = rewritten.reduce((sum, [, r]) => sum + r.changes.length, 0);

  const lines = [`Tailwind prefix "${prefix}": ${total} class(es) rewritten in ${rewritten.length} file(s).`];
  if (detailed) {
    for (const [label, { changes }] of rewritten) {
      const sample = changes
        .slice(0, SAMPLE_SIZE)
        .map((c) => `${c.from} → ${c.to}`)
        .join(', ');
      const more = changes.length > SAMPLE_SIZE ? `, … (+${changes.length - SAMPLE_SIZE})` : '';
      lines.push(`  ${label} (${changes.length}): ${sample}${more}`);
    }
  }
  lines.push(`Classes you pass in yourself (classNames, panelClass, @apply…) must carry the prefix too, e.g. ${prefix}:mt-2.`);
  p.log.info(lines.join('\n'));

  const flags = [...reports].flatMap(([label, r]) => r.flags.map((f) => `  ${label}:${f.line}  "${f.token}"`));
  if (flags.length) {
    p.log.warn(
      `Left unprefixed — a Tailwind utility name, but not in a class context (could be a value, not a class).\n` +
        `Check each one and prefix it by hand if it is a class:\n${flags.join('\n')}`,
    );
  }
}
