import { Component, computed, input, output } from '@angular/core';
import { LucideChevronRight, LucideDynamicIcon, type LucideIconInput } from '@lucide/angular';
import { Link } from '../link/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIconInput;
}

/**
 * Breadcrumb trail. Data-driven via `items` rather than content-projected, so the last-item
 * "current page" treatment and the separators between items can be derived structurally instead
 * of asking every consumer to remember to mark them by hand.
 *
 * Every item except the last renders through `ui-link` (this library's existing Link component)
 * so it inherits its focus/hover/disabled treatment for free. The last item is current-page: it
 * renders as plain text with `aria-current="page"` (not a link — you're already there) per the
 * WAI-ARIA breadcrumb pattern. Separator icons between items are `aria-hidden` since the `<ol>`
 * list structure already conveys the hierarchy to assistive tech; the trailing `nav[aria-label]`
 * is what identifies the whole region as a breadcrumb landmark.
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
