import { Component, computed, input, output } from '@angular/core';
import { LucideChevronRight, LucideDynamicIcon, type LucideIconInput } from '@lucide/angular';
import { Link } from '../link/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIconInput;
}

/**
 * Navigation trail showing the path to the current page.
 *
 * Built from `items` rather than projected content, so the current-page treatment and the
 * separators between items are handled automatically. Every item except the last renders as a
 * `ui-link`; the last renders as plain text with `aria-current="page"`.
 */
@Component({
  selector: 'ui-breadcrumb',
  imports: [Link, LucideDynamicIcon],
  templateUrl: './breadcrumb.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class Breadcrumb {
  /** Ordered breadcrumb trail; the last item renders as the current page (plain text, not a link). */
  readonly items = input.required<BreadcrumbItem[]>();
  /** Icon rendered between items. Defaults to a chevron pointing right. */
  readonly separatorIcon = input<LucideIconInput>(LucideChevronRight);
  /** Accessible name for the `<nav>` landmark. */
  readonly ariaLabel = input('Breadcrumb');
  /** Extra utility classes appended to the `<nav>` element. */
  readonly classNames = input('');

  /** Fires when a non-current (linked) item is clicked, alongside `ui-link`'s native click. */
  readonly itemClick = output<{ item: BreadcrumbItem; index: number; event: MouseEvent }>();

  protected readonly navClass = computed(() => this.classNames());

  protected onItemClick(item: BreadcrumbItem, index: number, event: MouseEvent): void {
    this.itemClick.emit({ item, index, event });
  }
}
