import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  PACKAGE_ROOT,
  addAll,
  compileComponents,
  createFixture,
  readStylesheet,
  snapshotComponents,
  candidatePositions,
} from './helpers/fixture.mjs';
import { nonClassReason } from './helpers/class-positions.mjs';
import { internalVariableNames, normalizeRules, utilitySelectors } from './helpers/css-compare.mjs';
import { loadTypeScript } from '../src/lib/prefix/load-deps.js';
import { updateCommand } from '../src/commands/update.mjs';
import { warnAboutLegacyTokens } from '../src/lib/legacy-tokens.js';
import { prefixToken } from '../src/lib/prefix/token.js';

const PREFIX = 'tw';

/**
 * End-to-end: every registry component installed into a consumer project with `prefix: "tw"`, next
 * to the same install without a prefix, both compiled with Tailwind v4 the way the consumer's build
 * would compile them.
 */
describe('Tailwind prefix — all components', () => {
  const ts = loadTypeScript(PACKAGE_ROOT, PACKAGE_ROOT);
  let prefixedCwd;
  let plainCwd;
  let prefixedFiles;
  let flaggedLinesByFile;
  /** Utilities an unprefixed build finds in the prefixed install, with where each was found. */
  let leftovers;

  beforeAll(async () => {
    prefixedCwd = await createFixture('prefixed', { prefix: PREFIX });
    const { prefixReports } = await addAll(prefixedCwd);
    flaggedLinesByFile = new Map([...prefixReports].map(([label, r]) => [label, new Set(r.flags.map((f) => f.line))]));

    plainCwd = await createFixture('plain');
    await addAll(plainCwd);

    prefixedFiles = snapshotComponents(prefixedCwd);
    // Plain Tailwind (+ ngmona's theme, so project utilities like text-label-lg are recognized too)
    // scanning the *prefixed* component files.
    const { css } = await compileComponents(plainCwd, readStylesheet(plainCwd), { files: prefixedFiles });
    const generated = new Set(utilitySelectors(css).map((selector) => selector.replace(/^\./, '').replace(/\\/g, '')));
    leftovers = new Map();
    for (const { file, candidate, position } of candidatePositions(prefixedFiles)) {
      if (!generated.has(candidate)) continue;
      const reason = nonClassReason(file, prefixedFiles[file], position, {
        ts,
        flaggedLines: flaggedLinesByFile.get(file) ?? new Set(),
      });
      const line = prefixedFiles[file].slice(0, position).split('\n').length;
      if (!leftovers.has(candidate)) leftovers.set(candidate, []);
      leftovers.get(candidate).push({ at: `${file}:${line}`, reason });
    }
  });

  it('leaves no class unprefixed: every utility an unprefixed build still finds comes from a non-class position', () => {
    // Tailwind's scanner reads every word in a file, so an unprefixed build of the prefixed install
    // is never literally empty: keywords (`static`), identifiers (`readonly underline = input()`),
    // attribute names (`aria-hidden`), JSDoc prose and component CSS (`display: block`) all look like
    // utilities to it. What must hold is that none of them sits where a class could be.
    const unexplained = [...leftovers].flatMap(([candidate, hits]) =>
      hits.filter((h) => h.reason === null).map((h) => `${candidate} at ${h.at}`),
    );
    expect(unexplained).toEqual([]);
    expect(leftovers.size).toBeLessThan(40); // sanity: the scan did find the usual noise
  });

  it('compiles, with prefix(tw), to the same CSS as the unprefixed install — rule by rule, apart from the prefix', async () => {
    const prefixed = await compileComponents(prefixedCwd, readStylesheet(prefixedCwd), { files: prefixedFiles });
    const plain = await compileComponents(plainCwd, readStylesheet(plainCwd));

    const prefixedRules = normalizeRules(prefixed.css, {
      prefix: PREFIX,
      fromPrefixed: true,
      internalVars: internalVariableNames(plain.css),
    });
    const plainRules = normalizeRules(plain.css, { prefix: PREFIX });

    expect(prefixedRules.length).toBeGreaterThan(500);
    // Everything the prefixed build generates, the unprefixed build generates too…
    const plainSet = new Set(plainRules);
    expect(prefixedRules.filter((rule) => !plainSet.has(rule))).toEqual([]);
    // …and the only extra rules in the unprefixed build are for the non-class words above
    // (plus the @property / base-layer bookkeeping they drag in, compared separately below).
    const prefixedSet = new Set(prefixedRules);
    const noise = [...leftovers]
      .filter(([, hits]) => hits.every((h) => h.reason !== null))
      .map(([candidate]) => `.«${prefixToken(candidate, PREFIX)}»`);
    const extraUtilities = plainRules.filter(
      (rule) => rule.startsWith('@layer utilities') && !prefixedSet.has(rule) && !noise.some((n) => rule.includes(n)),
    );
    expect(extraUtilities).toEqual([]);
  });

  it('is idempotent: running add a second time changes nothing and never double-prefixes', async () => {
    const before = snapshotComponents(prefixedCwd);
    const { results } = await addAll(prefixedCwd);
    expect(snapshotComponents(prefixedCwd)).toEqual(before);
    const actions = new Set(Object.values(results).flatMap((files) => files.map((f) => f.action)));
    expect([...actions]).toEqual(['unchanged']);
    expect(Object.values(before).some((content) => content.includes(`${PREFIX}:${PREFIX}:`))).toBe(false);
  });

  it('keeps update a no-op on an up-to-date prefixed install (hashes are of the prefixed output)', async () => {
    const before = snapshotComponents(prefixedCwd);
    await updateCommand({ cwd: prefixedCwd, packageRoot: PACKAGE_ROOT, names: [], yes: false, dryRun: false });
    expect(snapshotComponents(prefixedCwd)).toEqual(before);
  });

  it('writes theme files whose var() references use the prefixed names, and leaves the Tailwind import to the consumer', () => {
    const config = JSON.parse(readFileSync(join(prefixedCwd, 'ngmona.json'), 'utf8'));
    expect(config.tailwind.prefix).toBe(PREFIX);
    for (const file of [config.tailwind.themeCss, config.tailwind.tokensCss]) {
      const css = readFileSync(join(prefixedCwd, file), 'utf8');
      expect(css).toMatch(/var\(--tw-/);
      expect(css).not.toMatch(/var\(--(?!tw-)/);
    }
    const stylesheet = readStylesheet(prefixedCwd);
    expect(stylesheet.match(/@import 'tailwindcss'/g)).toHaveLength(1);
    expect(stylesheet).toContain(`prefix(${PREFIX})`);
  });

  it('makes the prefixed theme variables resolve: every var(--tw-…) used in the output is defined', async () => {
    const { css } = await compileComponents(prefixedCwd, readStylesheet(prefixedCwd), { files: prefixedFiles });
    const defined = new Set([...css.matchAll(/(--tw-[\w-]+)\s*:/g)].map((m) => m[1]));
    const registered = new Set([...css.matchAll(/@property (--tw-[\w-]+)/g)].map((m) => m[1]));
    // var(--x,) / var(--x, fallback) are optional by construction; only fallback-less references must exist.
    const required = [...css.matchAll(/var\((--tw-[\w-]+)\)/g)].map((m) => m[1]);
    const missing = [...new Set(required)].filter((name) => !defined.has(name) && !registered.has(name));
    expect(missing).toEqual([]);
  });
});

describe('Tailwind prefix — dry run', () => {
  it('writes nothing and reports the rewritten files', async () => {
    const cwd = await createFixture('dry-run', { prefix: PREFIX });
    const { results, prefixReports } = await addAll(cwd, { dryRun: true });
    expect(Object.keys(snapshotComponentsSafe(cwd))).toEqual([]);
    expect(new Set(results.button.map((f) => f.action))).toEqual(new Set(['created']));
    expect(prefixReports.get('button/button.ts').changes.length).toBeGreaterThan(10);
  });
});

describe('Tailwind prefix — added to ngmona.json after init', () => {
  it('brings the theme files init wrote without a prefix in line on the next add', async () => {
    const cwd = await createFixture('late-prefix');
    const configPath = join(cwd, 'ngmona.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    expect(readFileSync(join(cwd, config.tailwind.themeCss), 'utf8')).toMatch(/var\(--color-/);

    writeFileSync(configPath, JSON.stringify({ ...config, tailwind: { ...config.tailwind, prefix: PREFIX } }, null, 2));
    await addAll(cwd);

    for (const file of [config.tailwind.themeCss, config.tailwind.tokensCss]) {
      expect(readFileSync(join(cwd, file), 'utf8')).not.toMatch(/var\(--(?!tw-)/);
    }
    expect(snapshotComponents(cwd)['button/button.html']).toContain('tw:animate-spin');
  });
});

function snapshotComponentsSafe(cwd) {
  try {
    return snapshotComponents(cwd);
  } catch {
    return {};
  }
}

describe('tokens files written by an older init', () => {
  it('are reported: old 8px spacing and font weights would mis-size the new components', async () => {
    const cwd = await createFixture('legacy-tokens');
    const config = JSON.parse(readFileSync(join(cwd, 'ngmona.json'), 'utf8'));
    expect(warnAboutLegacyTokens(cwd, config)).toEqual([]);

    const tokensPath = join(cwd, config.tailwind.tokensCss);
    const current = readFileSync(tokensPath, 'utf8');
    writeFileSync(tokensPath, current.replace('--spacing: 0.25rem;', '--spacing: 8px;').replace('--font-weight-medium: 500;', '--font-weight-medium: 600;'));
    expect(warnAboutLegacyTokens(cwd, config)).toHaveLength(2);
  });

  it('are reported when the generated theme lacks the tokens severity buttons fill with', async () => {
    const cwd = await createFixture('legacy-theme');
    const config = JSON.parse(readFileSync(join(cwd, 'ngmona.json'), 'utf8'));
    const themePath = join(cwd, config.tailwind.themeCss);
    writeFileSync(themePath, readFileSync(themePath, 'utf8').replace(/^.*-medium: .*\n/gm, ''));
    expect(warnAboutLegacyTokens(cwd, config)).toEqual([expect.stringContaining('ngmona theme')]);
  });
});
