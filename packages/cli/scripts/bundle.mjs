#!/usr/bin/env node
// Bundles src/bin.mjs (+ commands/lib + @ngmona-ui/color + culori/commander/@clack/prompts) into
// a single dist/bin.mjs, so the published package never depends on workspace-only resolution or
// a separate @ngmona-ui/color publish.
//
// Run: node scripts/bundle.mjs (also runs as part of `npm run build`)

import { build } from 'esbuild';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chmodSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = join(__dirname, '..');

// CJS output, not ESM: commander (and its deps) use `require()` of Node builtins in ways
// esbuild's ESM-output CJS interop can't statically resolve (produces a "Dynamic require of
// node:events is not supported" runtime error). A `.cjs` bin entry works regardless of this
// package's own `"type": "module"`, since the file extension overrides it for Node's loader.
await build({
  entryPoints: [join(PACKAGE_ROOT, 'src', 'bin.mjs')],
  outfile: join(PACKAGE_ROOT, 'dist', 'bin.cjs'),
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node18',
  banner: { js: '#!/usr/bin/env node' },
  logLevel: 'info',
});

chmodSync(join(PACKAGE_ROOT, 'dist', 'bin.cjs'), 0o755);
