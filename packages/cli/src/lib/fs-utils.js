import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { createHash } from 'node:crypto';

export function hashContent(content) {
  return createHash('sha256').update(content).digest('hex').slice(0, 16);
}

/** Lists every file under `dir`, recursively, as paths relative to `dir` (POSIX separators). */
export function listFilesRecursive(dir) {
  const files = [];
  const walk = (current) => {
    for (const name of readdirSync(current)) {
      const full = join(current, name);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else {
        files.push(relative(dir, full).replace(/\\/g, '/'));
      }
    }
  };
  walk(dir);
  return files;
}

/**
 * Copies every file from `srcDir` into `destDir`, calling `onConflict(relPath)` -> boolean
 * (true = overwrite) when the destination already exists and differs. Returns the list of
 * { path, hash, action } written or skipped.
 */
export function copyEntry(srcDir, destDir, { onConflict, dryRun } = {}) {
  const results = [];
  for (const relPath of listFilesRecursive(srcDir)) {
    const srcPath = join(srcDir, relPath);
    const destPath = join(destDir, relPath);
    const content = readFileSync(srcPath);
    const hash = hashContent(content);

    let action = 'created';
    if (existsSync(destPath)) {
      const existingHash = hashContent(readFileSync(destPath));
      if (existingHash === hash) {
        action = 'unchanged';
      } else {
        const overwrite = onConflict ? onConflict(relPath) : false;
        action = overwrite ? 'overwritten' : 'skipped';
      }
    }

    if (!dryRun && (action === 'created' || action === 'overwritten')) {
      mkdirSync(dirname(destPath), { recursive: true });
      writeFileSync(destPath, content);
    }

    results.push({ path: relPath, hash, action });
  }
  return results;
}
