import { parseSeed } from './seed.js';
import { generateRamp } from './ramp.js';
import { resolveSemanticLayer } from './semantic-map.js';
import { ROLES } from './roles.js';

export { ROLES } from './roles.js';

/**
 * Builds a full theme (base ramps for every role + the resolved semantic layer) from one seed
 * color per role.
 *
 * @param {Record<string, string>} seeds role name -> hex or any CSS-color-parseable string
 * @returns {{ ramps: Record<string, Record<number, {l:number,c:number,h:number}>>, semantic: Record<string,string> }}
 */
export function buildTheme(seeds) {
  const missing = ROLES.filter((role) => !seeds[role]);
  if (missing.length) {
    throw new Error(`Missing seed color(s) for role(s): ${missing.join(', ')}`);
  }

  const ramps = {};
  for (const role of ROLES) {
    ramps[role] = generateRamp(parseSeed(seeds[role]));
  }

  const semantic = resolveSemanticLayer(ramps);

  return { ramps, semantic };
}
