import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const CONFIG_FILENAME = 'ngmona.json';

/** @returns {object|null} */
export function readConfig(cwd) {
  const path = join(cwd, CONFIG_FILENAME);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function writeConfig(cwd, config) {
  const path = join(cwd, CONFIG_FILENAME);
  writeFileSync(path, JSON.stringify(config, null, 2) + '\n', 'utf8');
}

/**
 * @param {{ themeCssPath: string, tokensCssPath: string, stylesheetPath: string, componentsPath: string, seeds: Record<string,string> }} opts
 */
export function createConfig({ themeCssPath, tokensCssPath, stylesheetPath, componentsPath, seeds }) {
  return {
    style: 'default',
    tailwind: {
      css: stylesheetPath,
      themeCss: themeCssPath,
      tokensCss: tokensCssPath,
    },
    aliases: {
      components: componentsPath,
    },
    theme: {
      seeds,
    },
    installed: {},
  };
}
