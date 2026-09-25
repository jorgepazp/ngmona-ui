/**
 * An independent oracle for "is this spot in a component file a place where a class could be?",
 * used to explain utilities that an *unprefixed* Tailwind build still finds in the *prefixed*
 * install. Tailwind's scanner reads every word-like token in a file — keywords (`static`),
 * identifiers (`readonly underline = input()`), attribute names (`aria-hidden` → `hidden`),
 * JSDoc prose, component CSS (`display: block`) — so some utilities are always generated. Each
 * one is acceptable only if *every* position it was found at is demonstrably not a class; a
 * missed class (a class-context string left unprefixed) is not explainable and fails the test.
 *
 * Deliberately simpler than the rewriter and written separately from it, so the test doesn't just
 * re-run the code under test.
 */

const CLASS_ATTRIBUTE = /^(class|\[class\]|\[class\..+\]|\[ngClass\]|\[className\]|\[attr\.class\]|animate\.(enter|leave)|\[?routerLinkActive\]?)$|class/i;

/**
 * @returns {string|null} why `pos` in `content` is not a class position, or null if it could be one.
 */
export function nonClassReason(file, content, pos, { ts, flaggedLines }) {
  const line = content.slice(0, pos).split('\n').length;
  if (flaggedLines.has(line)) return 'flagged by add';
  return file.endsWith('.html') ? htmlReason(content, pos, 0, content.length) : tsReason(file, content, pos, ts);
}

function tsReason(file, content, pos, ts) {
  const sf = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let literal = null;
  const visit = (node) => {
    if (pos < node.getStart(sf) || pos >= node.end) return;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      literal = node;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  if (!literal) return 'code or comment';

  if (ts.isPropertyAssignment(literal.parent) && literal.parent.name === literal) return 'object key';
  if (
    ts.isBinaryExpression(literal.parent) &&
    literal.parent.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
    /.style./.test(literal.parent.left.getText(sf))
  ) {
    return 'inline style assignment';
  }

  const prop = ts.isPropertyAssignment(literal.parent) && literal.parent.initializer === literal ? literal.parent : null;
  const key = prop && (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) ? prop.name.text : null;
  if (key === 'styles') return 'component CSS';
  if (key === 'template') return htmlReason(content, pos, literal.getStart(sf) + 1, literal.end - 1);
  if (key && /^\[(style|attr)\./.test(key)) return 'host style/attr binding';
  return null;
}

function htmlReason(content, pos, from, to) {
  let i = from;
  while (i < to) {
    if (content.startsWith('<!--', i)) {
      const close = content.indexOf('-->', i);
      if (pos < close + 3) return 'HTML comment';
      i = close + 3;
      continue;
    }
    if (content[i] !== '<' || !/[a-zA-Z]/.test(content[i + 1] ?? '')) {
      if (i === pos) return 'text';
      i++;
      continue;
    }
    // A start tag: name, then attributes.
    let j = i + 1;
    while (j < to && /[^\s/>]/.test(content[j])) j++;
    if (pos > i && pos < j) return 'tag name';
    while (j < to && content[j] !== '>') {
      if (/[\s/]/.test(content[j])) {
        j++;
        continue;
      }
      const nameStart = j;
      while (j < to && /[^\s=>]/.test(content[j])) j++;
      const name = content.slice(nameStart, j);
      if (pos >= nameStart && pos < j) return 'attribute name';
      if (content[j] !== '=') continue;
      j++;
      const quote = content[j];
      const valueStart = quote === '"' || quote === "'" ? j + 1 : j;
      const valueEnd = quote === '"' || quote === "'" ? content.indexOf(quote, valueStart) : j;
      if (pos >= valueStart && pos < valueEnd) {
        if (CLASS_ATTRIBUTE.test(name)) return null;
        if (/^\[(style|attr)\./.test(name)) return 'style/attr binding';
        if (!/^[[(*]/.test(name)) return 'non-class attribute';
        return null; // other bindings could carry classes into a child component
      }
      j = valueEnd + 1;
    }
    if (pos >= i && pos <= j) return 'tag';
    i = j + 1;
  }
  return 'text';
}
