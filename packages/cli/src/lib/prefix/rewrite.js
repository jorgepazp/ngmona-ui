import { isBareWord, isMarker, isPrefixed, prefixToken } from './token.js';

/**
 * Rewrites Tailwind classes in component source (`.html` templates and `.ts` files) so they carry a
 * Tailwind v4 prefix. Nothing here guesses from the shape of a string: a token is rewritten only if
 * Tailwind's own design system (`isUtility`) recognizes it, and how confident we need to be depends
 * on where the string sits:
 *
 *   - class context — `class="…"`, `[class]`/`[ngClass]`/`[class.x]` bindings, any other binding or
 *     static attribute whose name contains "class" (`classNames`, `panelClass`), `animate.enter`/
 *     `animate.leave`, `routerLinkActive`,
 *     `host: { class }`, and TS strings inside a declaration whose name contains "class"
 *     (`buttonClass = computed(…)`, `private sizeClass()`, `classNames = input('…')`). Every
 *     recognized utility (and `group`/`peer` marker) is rewritten; other tokens are left alone.
 *   - anywhere else ("maybe" context) — a string literal is rewritten only if *every* token in it
 *     is a recognized utility and at least one is more specific than a bare word. A string made only
 *     of bare words that happen to be utilities (`'hidden'`, `'block'`, `'fixed'`) is reported as a
 *     flag instead: it is as likely to be a CSS value or an input value as a class.
 *
 * Operands of comparisons (`variant() === 'icon'`, `case 'hidden':`) are never classes, whatever
 * the context.
 */

const CLASS_BINDING_NAMES = new Set(['class', 'ngClass', 'className', 'attr.class', 'routerLinkActive']);
/** Static attributes whose value is a class list even though the name doesn't say "class". */
const CLASS_ATTRIBUTE_NAMES = new Set(['animate.enter', 'animate.leave', 'routerLinkActive']);
const CLASS_API_CALLEES = /(^|\.)(classList\.(add|remove|toggle|replace)|addClass|removeClass)$/;
/** Calls whose string arguments flow straight into the declaration they're assigned to. */
const PASSTHROUGH_CALLEES = /(^|\.)(computed|signal|input|model|linkedSignal|concat|join|trim|filter)$/;
const SKIPPED_DECORATOR_KEYS = new Set(['selector', 'templateUrl', 'styleUrl', 'styleUrls', 'styles', 'exportAs']);
const COMPARISON_OPERATORS = new Set(['===', '!==', '==', '!=']);

/**
 * @param {{ prefix: string, isUtility: (token: string) => boolean, ts: typeof import('typescript') }} opts
 */
export function createPrefixer({ prefix, isUtility, ts }) {
  /**
   * @param {string} relPath used to pick the parser (.html vs .ts)
   * @param {string} text
   * @returns {{ content: string, changes: {line: number, from: string, to: string}[], flags: {line: number, token: string}[] }}
   */
  function rewriteFile(relPath, text) {
    const edits = [];
    const flags = [];
    const out = { edits, flags };
    if (relPath.endsWith('.html')) rewriteHtml(text, 0, text.length, out);
    else if (relPath.endsWith('.ts')) rewriteTs(text, out);
    else return { content: text, changes: [], flags: [] };

    edits.sort((a, b) => a.start - b.start);
    let content = '';
    let cursor = 0;
    const changes = [];
    for (const edit of edits) {
      if (edit.start < cursor) continue; // overlapping edit — first one wins
      content += text.slice(cursor, edit.start) + edit.text;
      cursor = edit.end;
      changes.push({ line: lineOf(text, edit.start), from: text.slice(edit.start, edit.end), to: edit.text });
    }
    content += text.slice(cursor);
    return {
      content,
      changes,
      flags: flags.map((f) => ({ line: lineOf(text, f.pos), token: f.token })),
    };
  }

  // ---------------------------------------------------------------------------------------------
  // Class lists

  /**
   * Rewrites the whitespace-separated class list in `text[start, end)`.
   * `openLeft`/`openRight`: the range touches an interpolation (`${…}` / `{{…}}`) on that side, so a
   * token running into it is only a fragment of a class name and can't be judged.
   */
  function rewriteClassList(text, start, end, mode, out, { openLeft = false, openRight = false } = {}) {
    const tokens = [];
    const re = /\S+/g;
    const slice = text.slice(start, end);
    let m;
    while ((m = re.exec(slice))) {
      const tokStart = start + m.index;
      const tokEnd = tokStart + m[0].length;
      const fragment = (openLeft && tokStart === start) || (openRight && tokEnd === end);
      tokens.push({ value: m[0], start: tokStart, end: tokEnd, fragment });
    }
    if (tokens.length === 0) return;

    const classify = (t) => {
      if (t.fragment) return 'fragment';
      if (isPrefixed(t.value, prefix)) return 'prefixed';
      if (isMarker(t.value)) return 'marker';
      return isUtility(t.value) ? 'utility' : 'other';
    };

    if (mode === 'class') {
      for (const t of tokens) {
        const kind = classify(t);
        if (kind === 'utility' || kind === 'marker') {
          out.edits.push({ start: t.start, end: t.end, text: prefixToken(t.value, prefix) });
        }
      }
      return;
    }

    // "maybe" context: all-or-nothing, and bare words alone aren't enough evidence.
    const kinds = tokens.map(classify);
    if (kinds.some((k) => k === 'other' || k === 'fragment')) return;
    const candidates = tokens.filter((_, i) => kinds[i] === 'utility' || kinds[i] === 'marker');
    if (candidates.length === 0) return;
    if (candidates.every((t) => isBareWord(t.value) || isMarker(t.value))) {
      for (const t of candidates) out.flags.push({ pos: t.start, token: t.value });
      return;
    }
    for (const t of candidates) {
      out.edits.push({ start: t.start, end: t.end, text: prefixToken(t.value, prefix) });
    }
  }

  // ---------------------------------------------------------------------------------------------
  // HTML templates

  function rewriteHtml(text, from, to, out) {
    let i = from;
    while (i < to) {
      if (text.startsWith('<!--', i)) {
        const close = text.indexOf('-->', i + 4);
        i = close === -1 ? to : close + 3;
      } else if (text.startsWith('{{', i)) {
        const close = text.indexOf('}}', i + 2);
        i = close === -1 ? to : close + 2;
      } else if (text[i] === '<' && /[a-zA-Z]/.test(text[i + 1] ?? '')) {
        i = rewriteTag(text, i + 1, to, out);
      } else {
        i++;
      }
    }
  }

  /** Parses the attributes of one start tag beginning at `i` (just past `<`); returns the index after `>`. */
  function rewriteTag(text, i, to, out) {
    while (i < to && /[^\s/>]/.test(text[i])) i++; // tag name
    while (i < to) {
      while (i < to && /\s/.test(text[i])) i++;
      if (text[i] === '>') return i + 1;
      if (text[i] === '/' && text[i + 1] === '>') return i + 2;
      if (text[i] === '/') {
        i++;
        continue;
      }

      const nameStart = i;
      while (i < to && /[^\s=>]/.test(text[i]) && !(text[i] === '/' && text[i + 1] === '>')) i++;
      const name = text.slice(nameStart, i);

      let j = i;
      while (j < to && /\s/.test(text[j])) j++;
      if (text[j] !== '=') {
        continue; // valueless attribute
      }
      j++;
      while (j < to && /\s/.test(text[j])) j++;

      let valueStart;
      let valueEnd;
      let quote = '';
      if (text[j] === '"' || text[j] === "'") {
        quote = text[j];
        valueStart = j + 1;
        valueEnd = text.indexOf(quote, valueStart);
        if (valueEnd === -1) valueEnd = to;
        i = valueEnd + 1;
      } else {
        valueStart = j;
        while (j < to && /[^\s>]/.test(text[j])) j++;
        valueEnd = j;
        i = j;
      }
      rewriteAttribute(text, name, nameStart, valueStart, valueEnd, quote, out);
    }
    return i;
  }

  function rewriteAttribute(text, name, nameStart, valueStart, valueEnd, quote, out) {
    const binding = /^\[(.+)\]$/.exec(name)?.[1] ?? /^bind-(.+)$/.exec(name)?.[1];
    if (binding !== undefined) {
      if (binding.startsWith('style') || binding.startsWith('@')) return;
      if (binding.startsWith('attr.') && binding !== 'attr.class') return; // ARIA roles, ids, …
      if (binding.startsWith('(')) {
        rewriteExpression(text, valueStart, valueEnd, 'maybe', quote, out); // [(two-way)]
        return;
      }
      if (binding.startsWith('class.')) {
        // [class.hidden]="cond" — the class is in the attribute name, the value is a condition.
        const offset = nameStart + name.indexOf(binding) + 'class.'.length;
        rewriteClassList(text, offset, offset + binding.length - 'class.'.length, 'class', out);
        rewriteExpression(text, valueStart, valueEnd, 'maybe', quote, out);
        return;
      }
      const isClass = CLASS_BINDING_NAMES.has(binding) || /class/i.test(binding);
      rewriteExpression(text, valueStart, valueEnd, isClass ? 'class' : 'maybe', quote, out, {
        objectKeysAreClasses: binding === 'ngClass' || binding === 'class',
      });
      return;
    }
    if (/^\(.+\)$/.test(name) || /^on-/.test(name)) {
      rewriteExpression(text, valueStart, valueEnd, 'maybe', quote, out);
      return;
    }
    if (name.startsWith('*') || name.startsWith('#') || name.startsWith('@')) return;

    // Static attribute: only class-bearing ones are touched; `variant="primary"` etc. are plain text.
    if (/class/i.test(name) || CLASS_ATTRIBUTE_NAMES.has(name)) {
      rewriteInterpolatedClassList(text, valueStart, valueEnd, quote, out);
    }
  }

  /** `class="static {{ expr }} static"` — static parts and interpolated expressions are both classes. */
  function rewriteInterpolatedClassList(text, start, end, quote, out) {
    let cursor = start;
    while (cursor < end) {
      const open = text.indexOf('{{', cursor);
      if (open === -1 || open >= end) {
        rewriteClassList(text, cursor, end, 'class', out, { openLeft: cursor !== start });
        return;
      }
      rewriteClassList(text, cursor, open, 'class', out, { openLeft: cursor !== start, openRight: true });
      const close = text.indexOf('}}', open + 2);
      const exprEnd = close === -1 || close > end ? end : close;
      rewriteExpression(text, open + 2, exprEnd, 'class', quote, out);
      cursor = exprEnd + 2;
    }
  }

  /**
   * Angular template expressions are close enough to TS expressions (pipes parse as `|`) to reuse
   * the TS parser for finding string literals in them.
   */
  function rewriteExpression(text, start, end, mode, quote, out, { objectKeysAreClasses = false } = {}) {
    const source = text.slice(start, end);
    if (!/['"`]/.test(source) && !objectKeysAreClasses) return;
    const wrapped = `(${source})`;
    const sf = ts.createSourceFile('expr.ts', wrapped, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const local = { edits: [], flags: [] };
    visitLiterals(sf, wrapped, mode, local, { objectKeysAreClasses, keyQuote: quote === "'" ? '"' : "'" });
    for (const e of local.edits) out.edits.push({ ...e, start: e.start - 1 + start, end: e.end - 1 + start });
    for (const f of local.flags) out.flags.push({ ...f, pos: f.pos - 1 + start });
  }

  // ---------------------------------------------------------------------------------------------
  // TypeScript

  function rewriteTs(text, out) {
    const sf = ts.createSourceFile('file.ts', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    visitLiterals(sf, text, 'maybe', out, {});
  }

  function visitLiterals(sf, text, rootMode, out, { objectKeysAreClasses = false, keyQuote = "'" }) {
    const visit = (node) => {
      if (
        ts.isImportDeclaration(node) ||
        ts.isExportDeclaration(node) ||
        ts.isLiteralTypeNode(node) ||
        ts.isImportTypeNode(node) ||
        ts.isExternalModuleReference(node)
      ) {
        return;
      }

      if (ts.isPropertyAssignment(node) && isDecoratorMetadata(node)) {
        const key = propertyName(node.name);
        if (SKIPPED_DECORATOR_KEYS.has(key)) return;
        if (key === 'template' && (ts.isStringLiteral(node.initializer) || ts.isNoSubstitutionTemplateLiteral(node.initializer))) {
          rewriteHtml(text, node.initializer.getStart(sf) + 1, node.initializer.end - 1, out);
          return;
        }
        if (key === 'host' && ts.isObjectLiteralExpression(node.initializer)) {
          rewriteHostMetadata(node.initializer, sf, text, out);
          return;
        }
      }

      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        const mode = literalMode(node, rootMode, objectKeysAreClasses);
        if (mode) {
          rewriteClassList(text, node.getStart(sf) + 1, node.end - 1, mode === 'key' ? 'class' : mode, out);
        }
        return;
      }

      if (ts.isTemplateExpression(node)) {
        const mode = literalMode(node, rootMode, objectKeysAreClasses);
        if (mode) {
          const head = node.head;
          rewriteClassList(text, head.getStart(sf) + 1, head.end - 2, mode, out, { openRight: true });
          node.templateSpans.forEach((span, index) => {
            const isLast = index === node.templateSpans.length - 1;
            const lit = span.literal;
            rewriteClassList(text, lit.getStart(sf) + 1, lit.end - (isLast ? 1 : 2), mode, out, {
              openLeft: true,
              openRight: !isLast,
            });
          });
        }
        node.templateSpans.forEach((span) => visit(span.expression));
        return;
      }

      // ngClass-style object keys that are bare identifiers: `{ hidden: cond }`.
      if (
        objectKeysAreClasses &&
        (ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node)) &&
        ts.isIdentifier(node.name) &&
        ts.isObjectLiteralExpression(node.parent)
      ) {
        const token = node.name.text;
        if (!isPrefixed(token, prefix) && (isMarker(token) || isUtility(token))) {
          const keyText = `${keyQuote}${prefixToken(token, prefix)}${keyQuote}`;
          out.edits.push({
            start: node.name.getStart(sf),
            end: node.name.end,
            text: ts.isShorthandPropertyAssignment(node) ? `${keyText}: ${token}` : keyText,
          });
        }
      }

      ts.forEachChild(node, visit);
    };
    visit(sf);
  }

  /** `host: { class: '…', '[class]': 'expr', '[class.x]': 'cond' }` */
  function rewriteHostMetadata(obj, sf, text, out) {
    for (const prop of obj.properties) {
      if (!ts.isPropertyAssignment(prop) || !isStringish(prop.initializer)) continue;
      const key = propertyName(prop.name);
      const valueStart = prop.initializer.getStart(sf) + 1;
      const valueEnd = prop.initializer.end - 1;
      const quote = text[valueStart - 1];
      if (key === 'class') {
        rewriteClassList(text, valueStart, valueEnd, 'class', out);
      } else if (key && /^\[.+\]$/.test(key) && ts.isStringLiteral(prop.name)) {
        rewriteAttribute(text, key, prop.name.getStart(sf) + 1, valueStart, valueEnd, quote, out);
      } else if (key && /^\(.+\)$/.test(key)) {
        rewriteExpression(text, valueStart, valueEnd, 'maybe', quote, out);
      }
    }
  }

  /**
   * Decides how a literal is treated from where it sits: 'class', 'maybe', 'key' (a class-context
   * object key), or null (skip).
   */
  function literalMode(node, rootMode, objectKeysAreClasses) {
    let child = node;
    let parent = node.parent;

    if (ts.isPropertyAssignment(parent) && parent.name === node) {
      return objectKeysAreClasses && ts.isObjectLiteralExpression(parent.parent) ? 'key' : null;
    }
    if (ts.isComputedPropertyName(parent) || ts.isElementAccessExpression(parent)) return null;

    while (parent) {
      if (ts.isBinaryExpression(parent)) {
        const op = ts.tokenToString(parent.operatorToken.kind);
        if (COMPARISON_OPERATORS.has(op)) return null;
        if (op === '=' && parent.right === child && /\.style\b/.test(parent.left.getText())) return null;
      }
      if ((ts.isCaseClause(parent) || ts.isSwitchStatement(parent) || ts.isIfStatement(parent)) && parent.expression === child) {
        return null;
      }
      if (ts.isConditionalExpression(parent) && parent.condition === child) return null;
      if (ts.isCallExpression(parent) && parent.arguments.includes(child) && !ts.isFunctionLike(child)) {
        const callee = parent.expression.getText();
        if (CLASS_API_CALLEES.test(callee)) return 'class';
        if (/(^|\.)setStyle$/.test(callee)) return null;
        if (!PASSTHROUGH_CALLEES.test(callee)) return rootMode === 'class' ? 'maybe' : rootMode;
      }
      if (isNamedDeclaration(parent) && /class/i.test(declarationName(parent))) return 'class';
      child = parent;
      parent = parent.parent;
    }
    return rootMode;
  }

  function isNamedDeclaration(node) {
    return (
      ts.isPropertyDeclaration(node) ||
      ts.isVariableDeclaration(node) ||
      ts.isPropertyAssignment(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isGetAccessorDeclaration(node) ||
      ts.isFunctionDeclaration(node) ||
      ts.isParameter(node)
    );
  }

  function declarationName(node) {
    return node.name ? propertyName(node.name) ?? '' : '';
  }

  function propertyName(name) {
    if (ts.isIdentifier(name) || ts.isPrivateIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
      return name.text;
    }
    return undefined;
  }

  function isStringish(node) {
    return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);
  }

  /** A property of the object literal passed to a decorator call, e.g. `@Component({ … })`. */
  function isDecoratorMetadata(prop) {
    const obj = prop.parent;
    const call = obj?.parent;
    return ts.isObjectLiteralExpression(obj) && call && ts.isCallExpression(call) && ts.isDecorator(call.parent);
  }

  return { rewriteFile };
}

function lineOf(text, pos) {
  let line = 1;
  for (let i = 0; i < pos; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}
