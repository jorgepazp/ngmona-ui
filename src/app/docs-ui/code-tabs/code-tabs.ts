import { Component, computed, input, signal } from '@angular/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';

// Highlighting happens in `highlighted()` below. Without this, Prism also runs its own automatic
// highlightAll() shortly after load, which re-highlights (and adds `language-*` to the <pre> of)
// only the code blocks that happen to be rendered by then — so a block's styling depended on timing.
Prism.manual = true;

type CodeLang = 'html' | 'ts';

/**
 * Tabbed, syntax-highlighted code viewer for docs examples. Pass the template markup via `html`
 * and/or the component code via `ts`; only the languages actually provided get a tab.
 */
@Component({
  selector: 'docs-code-tabs',
  templateUrl: './code-tabs.html',
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
})
export class CodeTabs {
  readonly html = input<string | undefined>(undefined);
  readonly ts = input<string | undefined>(undefined);

  protected readonly tabs = computed<CodeLang[]>(() => {
    const list: CodeLang[] = [];
    if (this.html()) list.push('html');
    if (this.ts()) list.push('ts');
    return list;
  });

  private readonly selectedTab = signal<CodeLang | undefined>(undefined);
  protected readonly activeTab = computed(() => this.selectedTab() ?? this.tabs()[0]);

  protected readonly languageClass = computed(() =>
    this.activeTab() === 'html' ? 'language-markup' : 'language-typescript',
  );

  protected readonly highlighted = computed(() => {
    const tab = this.activeTab();
    const code = (tab === 'html' ? this.html() : this.ts())?.trim() ?? '';
    return tab === 'html'
      ? Prism.highlight(code, Prism.languages['markup'], 'markup')
      : Prism.highlight(code, Prism.languages['typescript'], 'typescript');
  });

  protected select(tab: CodeLang): void {
    this.selectedTab.set(tab);
  }
}
