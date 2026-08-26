import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const LOCKFILES = [
  ['pnpm-lock.yaml', 'pnpm'],
  ['yarn.lock', 'yarn'],
  ['package-lock.json', 'npm'],
];

export function detectPackageManager(cwd) {
  for (const [lockfile, manager] of LOCKFILES) {
    if (existsSync(join(cwd, lockfile))) return manager;
  }
  return 'npm';
}

function addCommand(manager, packages) {
  switch (manager) {
    case 'pnpm':
      return ['pnpm', ['add', ...packages]];
    case 'yarn':
      return ['yarn', ['add', ...packages]];
    default:
      return ['npm', ['install', ...packages]];
  }
}

/** @returns {{ ok: boolean, manager: string, packages: string[] }} */
export function installPackages(cwd, packages, { dryRun = false } = {}) {
  if (packages.length === 0) return { ok: true, manager: detectPackageManager(cwd), packages: [] };
  const manager = detectPackageManager(cwd);
  if (dryRun) return { ok: true, manager, packages };

  const [cmd, args] = addCommand(manager, packages);
  const result = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  return { ok: result.status === 0, manager, packages };
}

export function readConsumerDependencyNames(cwd) {
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) return new Set();
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  return new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})]);
}
