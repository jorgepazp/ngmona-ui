#!/usr/bin/env node
// Scans src/app/registry/**/*.ts for @Component/@Directive classes and generates a colocated
// <name>.api.ts next to each one, extracting the class-level JSDoc plus every readonly
// input()/model()/output() property's JSDoc, type and default value.
//
// The scanning/parsing itself lives in scripts/lib/component-scanner.mjs (shared with the CLI's
// registry.json builder) — this file is just the api-docs-specific rendering/writing step.
//
// Run: npm run api-docs

import { writeFileSync } from 'node:fs';
import { dirname, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { walkComponentFiles, parseComponentFile } from './lib/component-scanner.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_ROOT = join(__dirname, '..', 'src', 'app', 'registry');
const API_TABLE_MODULE = 'src/app/docs-ui/api-table/api-table';

function toApiFile(filePath, parsed) {
  const varName = parsed.className.charAt(0).toLowerCase() + parsed.className.slice(1) + 'Api';
  const relImport = relative(dirname(filePath), join(__dirname, '..', API_TABLE_MODULE)).replace(/\\/g, '/');
  const importPath = relImport.startsWith('.') ? relImport : './' + relImport;

  const propsLiteral = parsed.props
    .map(
      (p) => `    {
      name: ${JSON.stringify(p.name)},
      kind: ${JSON.stringify(p.kind)},
      required: ${p.required},
      type: ${JSON.stringify(p.type)},
      defaultValue: ${JSON.stringify(p.defaultValue)},
      description: ${JSON.stringify(p.description)},
    },`,
    )
    .join('\n');

  return `// GENERATED FILE — do not edit by hand. Run \`npm run api-docs\` to regenerate.
import type { ComponentApiDoc } from '${importPath}';

export const ${varName}: ComponentApiDoc = {
  name: ${JSON.stringify(parsed.className)},
  description: ${JSON.stringify(parsed.description)},
  props: [
${propsLiteral}
  ],
};
`;
}

function main() {
  const files = walkComponentFiles(REGISTRY_ROOT);
  let generated = 0;
  let skippedNoClass = 0;
  const warnings = [];

  for (const file of files) {
    const parsed = parseComponentFile(file);
    if (!parsed) {
      skippedNoClass++;
      continue;
    }
    if (!parsed.description) {
      warnings.push(`  - ${relative(REGISTRY_ROOT, file)}: class "${parsed.className}" has no JSDoc`);
    }
    for (const p of parsed.props) {
      if (!p.description) {
        warnings.push(`  - ${relative(REGISTRY_ROOT, file)}: "${p.name}" (${p.kind}) has no JSDoc`);
      }
    }

    const apiFilePath = file.replace(/\.ts$/, '.api.ts');
    writeFileSync(apiFilePath, toApiFile(apiFilePath, parsed), 'utf8');
    generated++;
  }

  console.log(`Generated ${generated} .api.ts files (${skippedNoClass} files had no exported class, skipped).`);
  if (warnings.length) {
    console.log(`\n${warnings.length} missing-JSDoc warning(s):`);
    console.log(warnings.join('\n'));
  }
}

main();
