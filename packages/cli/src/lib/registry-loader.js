import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** @param {string} packageRoot */
export function loadRegistry(packageRoot) {
  const manifestPath = join(packageRoot, 'registry.json');
  return JSON.parse(readFileSync(manifestPath, 'utf8'));
}

export function findComponent(registry, name) {
  const needle = name.toLowerCase();
  return registry.components.find((c) => c.name.toLowerCase() === needle);
}

/** Expands a list of requested component names into every entry needed, transitively, deduped. */
export function resolveWithDependencies(registry, requestedNames) {
  const resolved = new Map();
  const missing = [];
  const queue = [...requestedNames];

  while (queue.length) {
    const name = queue.shift();
    if (resolved.has(name.toLowerCase())) continue;
    const entry = findComponent(registry, name);
    if (!entry) {
      missing.push(name);
      continue;
    }
    resolved.set(entry.name.toLowerCase(), entry);
    for (const dep of entry.registryDependencies) {
      if (!resolved.has(dep.toLowerCase())) queue.push(dep);
    }
  }

  return { resolved: [...resolved.values()], missing };
}

/** @param {string} packageRoot */
export function registrySourceDir(packageRoot, componentName) {
  return join(packageRoot, 'registry', componentName);
}
