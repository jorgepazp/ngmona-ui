import { beforeAll, describe, expect, it } from 'vitest';
import { PACKAGE_ROOT } from './helpers/fixture.mjs';
import { loadClassDetector, loadTypeScript } from '../src/lib/prefix/load-deps.js';
import { createPrefixer } from '../src/lib/prefix/rewrite.js';
import { prefixToken } from '../src/lib/prefix/token.js';
import { prefixThemeReferences } from '../src/lib/prefix/theme.js';

describe('prefixToken', () => {
  it.each([
    ['flex', 'tw:flex'],
    ['hover:bg-primary-300', 'tw:hover:bg-primary-300'],
    ['!border-none', 'tw:border-none!'],
    ['[&:not(:active)]:focus:!outline-primary-500', 'tw:[&:not(:active)]:focus:outline-primary-500!'],
    ['group', 'tw:group'],
    ['peer', 'tw:peer'],
    ['group-hover:underline', 'tw:group-hover:underline'],
    ['-mt-2', 'tw:-mt-2'],
    ['!-mt-2', 'tw:-mt-2!'],
    ['w-[calc(100%-2rem)]', 'tw:w-[calc(100%-2rem)]'],
    ['bg-[url(https://x.io/a.png)]', 'tw:bg-[url(https://x.io/a.png)]'],
    ['tw:flex', 'tw:flex'],
  ])('%s -> %s', (input, expected) => {
    expect(prefixToken(input, 'tw')).toBe(expected);
  });
});

describe('createPrefixer', () => {
  let rewrite;
  beforeAll(async () => {
    const ts = loadTypeScript(PACKAGE_ROOT, PACKAGE_ROOT);
    const { isUtility } = await loadClassDetector({ cwd: PACKAGE_ROOT, packageRoot: PACKAGE_ROOT, config: {} });
    const prefixer = createPrefixer({ prefix: 'tw', isUtility, ts });
    rewrite = (file, text) => prefixer.rewriteFile(file, text);
  });

  describe('templates', () => {
    it('rewrites static class attributes, leaving non-utility classes alone', () => {
      const { content } = rewrite('a.html', '<div class="flex ui-panel !px-3 group" id="flex"></div>');
      expect(content).toBe('<div class="tw:flex ui-panel tw:px-3! tw:group" id="flex"></div>');
    });

    it('rewrites string literals in [class] bindings but not comparison operands', () => {
      const { content } = rewrite('a.html', `<b [class]="variant() === 'hidden' ? 'block text-label-lg' : 'hidden'"></b>`);
      expect(content).toBe(`<b [class]="variant() === 'hidden' ? 'tw:block tw:text-label-lg' : 'tw:hidden'"></b>`);
    });

    it('rewrites [ngClass] object keys, quoting identifier keys', () => {
      const { content } = rewrite('a.html', `<b [ngClass]="{ hidden: a, 'mt-2 flex': b, custom: c }"></b>`);
      expect(content).toBe(`<b [ngClass]="{ 'tw:hidden': a, 'tw:mt-2 tw:flex': b, custom: c }"></b>`);
    });

    it('rewrites the class in [class.x] and interpolations inside class', () => {
      const { content } = rewrite('a.html', `<b [class.hidden]="x" [class.expanded]="y" class="relative {{ open() ? 'flex' : '' }} z-10"></b>`);
      expect(content).toBe(`<b [class.tw:hidden]="x" [class.expanded]="y" class="tw:relative {{ open() ? 'tw:flex' : '' }} tw:z-10"></b>`);
    });

    it('treats class-named inputs as class context and leaves style/attr bindings and other inputs alone', () => {
      const { content, flags } = rewrite(
        'a.html',
        `<ui-x [classNames]="'mt-2'" panelClass="hidden" [style.display]="'block'" [attr.role]="'group'" variant="fixed"></ui-x>`,
      );
      expect(content).toBe(`<ui-x [classNames]="'tw:mt-2'" panelClass="tw:hidden" [style.display]="'block'" [attr.role]="'group'" variant="fixed"></ui-x>`);
      expect(flags).toEqual([]);
    });

    it('treats routerLinkActive as a class list', () => {
      const { content } = rewrite('a.html', `<a routerLink="/x" routerLinkActive="bg-surface-medium font-medium active"></a>`);
      expect(content).toBe(`<a routerLink="/x" routerLinkActive="tw:bg-surface-medium tw:font-medium active"></a>`);
    });

    it('never touches a consumer-supplied classNames() value', () => {
      const text = `<div [class]="base() + ' ' + classNames()"></div>`;
      expect(rewrite('a.html', text).content).toBe(text);
    });
  });

  describe('TypeScript', () => {
    it('rewrites class strings built in computed() / template literals, skipping fragments', () => {
      const text = [
        'class C {',
        "  readonly buttonClass = computed(() => {",
        "    const base = `select-none flex !border-none text-${this.tone()} ${this.sizeClass()} hover:bg-primary-300`;",
        "    return this.variant() === 'icon' ? `${base} !rounded-full` : base;",
        '  });',
        "  readonly classNames = input('text-primary-500');",
        '}',
      ].join('\n');
      const { content } = rewrite('c.ts', text);
      expect(content).toContain("`tw:select-none tw:flex tw:border-none! text-${this.tone()} ${this.sizeClass()} tw:hover:bg-primary-300`");
      expect(content).toContain("this.variant() === 'icon' ? `${base} tw:rounded-full!` : base");
      expect(content).toContain("input('tw:text-primary-500')");
    });

    it('rewrites host classes and inline templates', () => {
      const text = "@Component({ selector: 'ui-row', template: `<div class=\"w-full\"></div>`, host: { class: 'border-b hover:bg-surface-light' } })\nclass R {}";
      const { content } = rewrite('r.ts', text);
      expect(content).toContain("selector: 'ui-row'");
      expect(content).toContain('<div class="tw:w-full"></div>');
      expect(content).toContain("class: 'tw:border-b tw:hover:bg-surface-light'");
    });

    it('rewrites all-utility strings outside a class context, flags bare-word ones, ignores the rest', () => {
      const text = [
        "const SIZES = { sm: 'h-4 w-4', md: 'h-6 w-6' };",
        "const mode = 'hidden';",
        "const label = 'Show hidden items';",
        "type Pos = 'left' | 'right';",
        "el.style.overflow = 'hidden';",
        "import { x } from './flex';",
      ].join('\n');
      const { content, flags } = rewrite('m.ts', text);
      expect(content).toContain("{ sm: 'tw:h-4 tw:w-4', md: 'tw:h-6 tw:w-6' }");
      expect(content).toContain("const mode = 'hidden';");
      expect(content).toContain("'Show hidden items'");
      expect(content).toContain("el.style.overflow = 'hidden'");
      expect(content).toContain("from './flex'");
      expect(flags).toEqual([{ line: 2, token: 'hidden' }]);
    });

    it('leaves CSS custom properties alone', () => {
      const text = "class B { readonly barClass = computed(() => 'var(--color-primary-500) --gap bg-primary-500'); }";
      expect(rewrite('v.ts', text).content).toBe("class B { readonly barClass = computed(() => 'var(--color-primary-500) --gap tw:bg-primary-500'); }");
    });
  });

  it('is idempotent', () => {
    const html = `<div class="flex !px-3 hover:bg-primary-300" [class]="a ? 'hidden' : 'block'"></div>`;
    const once = rewrite('a.html', html).content;
    expect(rewrite('a.html', once).content).toBe(once);
    expect(once).not.toContain('tw:tw:');
  });
});

describe('prefixThemeReferences', () => {
  it('rewrites var() references inside @theme only, and only once', () => {
    const css = '@theme static {\n  --color-a: var(--color-primary-300);\n}\n.x { color: var(--color-a); }\n';
    const once = prefixThemeReferences(css, 'tw');
    expect(once).toBe('@theme static {\n  --color-a: var(--tw-color-primary-300);\n}\n.x { color: var(--color-a); }\n');
    expect(prefixThemeReferences(once, 'tw')).toBe(once);
  });
});
