// Shared scanning/parsing primitives over src/app/registry/**, extracted from the original
// generate-api-docs.mjs so the same logic backs both API-doc generation and the CLI's
// registry.json builder (packages/cli/scripts/build-registry.mjs).
//
// This is a hand-rolled line/bracket scanner, not a full TS-AST parser — justified because the
// registry's signal declarations are syntactically uniform: always `readonly x = fn(...)`, always
// single-line, no decorators/destructuring (confirmed by an audit before writing this). The two
// things a naive regex would get wrong, and that this handles explicitly, are:
//   1. `input.required<T>()` — the `.required` sits between the function name and the call.
//   2. `readonly x = computed(...)/signal(...)/viewChild(...)/contentChildren(...)` — same shape
//      as an input/model/output declaration, but must NOT be swept in. The function name is
//      whitelisted, not just "any readonly assignment", to avoid this.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SIGNAL_FNS = new Set(['input', 'model', 'output']);

/** Walks a directory recursively, returning component source files (excludes generated/spec/type files). */
export function walkComponentFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walkComponentFiles(full, files);
    } else if (
      entry.endsWith('.ts') &&
      !entry.endsWith('.api.ts') &&
      !entry.endsWith('.spec.ts') &&
      !entry.endsWith('.type.ts')
    ) {
      files.push(full);
    }
  }
  return files;
}

function stripJsDocMarkers(block) {
  return block
    .replace(/^\s*\/\*\*/, '')
    .replace(/\*\/\s*$/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\*\s?/, '').trim())
    .filter(Boolean)
    .join(' ')
    .trim();
}

/** Scans upward from `index` (exclusive) for a contiguous /** *\/ block, skipping blank lines. */
function extractJsDocAbove(lines, index) {
  let i = index - 1;
  while (i >= 0 && lines[i].trim() === '') i--;
  if (i < 0 || !lines[i].trim().endsWith('*/')) return '';
  const end = i;
  while (i >= 0 && !lines[i].trim().startsWith('/**')) {
    if (!lines[i].trim().endsWith('*/') && !lines[i].trim().startsWith('*') && lines[i].trim() !== '') {
      // Hit non-comment content before finding the opening /** — not actually a doc block.
      return '';
    }
    i--;
  }
  if (i < 0) return '';
  return stripJsDocMarkers(lines.slice(i, end + 1).join('\n'));
}

/** Matches parens, skipping `=>` so arrow-function types inside don't confuse depth counting. */
function findMatchingParen(str, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < str.length; i++) {
    if (str[i] === '(') depth++;
    else if (str[i] === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** Matches angle brackets, skipping `=>` entirely so it's never mistaken for a closing `>`. */
function findMatchingAngle(str, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < str.length; i++) {
    if (str[i] === '=' && str[i + 1] === '>') {
      i++;
      continue;
    }
    if (str[i] === '<') depth++;
    else if (str[i] === '>') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function balanceDepth(s) {
  let d = 0;
  for (const ch of s) {
    if (ch === '(' || ch === '<') d++;
    else if (ch === ')' || ch === '>') d--;
  }
  return d;
}

/** Splits a call's argument list on top-level commas (ignoring commas inside brackets and strings). */
function splitTopLevelArgs(args) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let start = 0;
  for (let i = 0; i < args.length; i++) {
    const ch = args[i];
    if (quote) {
      if (ch === quote && args[i - 1] !== '\\') quote = null;
    } else if (ch === '"' || ch === "'" || ch === '`') quote = ch;
    else if ('([{<'.includes(ch)) depth++;
    else if (')]}>'.includes(ch) && args[i - 1] !== '=') depth--;
    else if (ch === ',' && depth === 0) {
      parts.push(args.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(args.slice(start).trim());
  return parts.filter((p, i) => p !== '' || i === 0);
}

function inferType(defaultValue) {
  const v = defaultValue.trim();
  if (v === '' || v === 'undefined') return 'unknown';
  if (v === 'true' || v === 'false') return 'boolean';
  if (/^-?\d+(\.\d+)?$/.test(v)) return 'number';
  if (/^['"`]/.test(v)) return 'string';
  if (v.startsWith('[')) return 'unknown[]';
  if (v.startsWith('{')) return 'object';
  if (v.startsWith('(') || v.includes('=>')) return 'Function';
  return 'unknown';
}

const DECL_RE = /^\s*(?:protected\s+|private\s+)?readonly\s+(\w+)\s*=\s*(input|model|output)(\.required)?\s*[(<]/;

/** Parses one component/directive source file into { className, description, props }, or null if no exported class. */
export function parseComponentFile(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const lines = source.split('\n');

  const classMatch = source.match(/export class (\w+)/);
  if (!classMatch) return null;
  const className = classMatch[1];
  const classLineIdx = lines.findIndex((l) => l.includes(`export class ${className}`));

  // Decorators are multi-line (e.g. `@Component({ selector: ..., imports: [...], ... })`), so the
  // line immediately above `export class` is almost never the decorator's own opening line — walk
  // all the way back to find it instead of bailing out on the first non-blank line.
  let decoratorStart = -1;
  for (let j = classLineIdx - 1; j >= 0; j--) {
    if (/^@(Component|Directive|Injectable)\(/.test(lines[j].trim())) {
      decoratorStart = j;
      break;
    }
  }
  const description = extractJsDocAbove(lines, decoratorStart >= 0 ? decoratorStart : classLineIdx);

  const props = [];
  for (let idx = 0; idx < lines.length; idx++) {
    const m = lines[idx].match(DECL_RE);
    if (!m) continue;
    const [, name, fn, requiredFlag] = m;
    if (!SIGNAL_FNS.has(fn)) continue;
    const required = !!requiredFlag;

    // Declarations are single-line in this codebase, but defensively join more lines if the
    // bracket depth isn't balanced yet (e.g. a rare wrapped declaration).
    let stmt = lines[idx];
    let depth = balanceDepth(stmt);
    let cursor = idx;
    while (depth > 0 && cursor < lines.length - 1) {
      cursor++;
      stmt += '\n' + lines[cursor];
      depth += balanceDepth(lines[cursor]);
    }

    const fnNameEnd = stmt.indexOf(fn) + fn.length + (required ? '.required'.length : 0);
    const afterFn = stmt.slice(fnNameEnd);

    let type = '';
    let searchFrom = fnNameEnd;
    if (afterFn.trimStart().startsWith('<')) {
      const ltIdx = fnNameEnd + afterFn.indexOf('<');
      const gtIdx = findMatchingAngle(stmt, ltIdx);
      if (gtIdx > -1) {
        type = stmt.slice(ltIdx + 1, gtIdx).trim();
        searchFrom = gtIdx;
      }
    }

    const parenIdx = stmt.indexOf('(', searchFrom);
    let defaultValue = '';
    if (parenIdx > -1) {
      const closeParen = findMatchingParen(stmt, parenIdx);
      if (closeParen > -1) {
        defaultValue = stmt.slice(parenIdx + 1, closeParen).trim();
      }
    }

    // `input(default, { alias, transform })`: the options object isn't part of the default. An alias
    // is the name templates actually use; `booleanAttribute` means the input is a boolean.
    let publicName = name;
    const [firstArg, options = ''] = splitTopLevelArgs(defaultValue);
    if (options) {
      defaultValue = firstArg;
      const alias = options.match(/alias:\s*['"]([^'"]+)['"]/);
      if (alias) publicName = alias[1];
      if (!type && /transform:\s*booleanAttribute\b/.test(options)) type = 'boolean';
    }

    if (!type) type = inferType(defaultValue);

    const kind = fn === 'model' ? 'model' : fn === 'output' ? 'output' : 'input';
    const propDescription = extractJsDocAbove(lines, idx);
    props.push({ name: publicName, kind, required, type, defaultValue, description: propDescription });
  }

  return { className, description, props };
}

const IMPORT_RE = /^\s*import\s+(?:type\s+)?(?:[\w*{}\s,]+\s+from\s+)?['"]([^'"]+)['"]/gm;

/** Extracts every import specifier referenced by a .ts file, e.g. ['../shared/animations', '@angular/core']. */
export function extractImportSpecifiers(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const specifiers = [];
  for (const match of source.matchAll(IMPORT_RE)) {
    specifiers.push(match[1]);
  }
  return specifiers;
}
