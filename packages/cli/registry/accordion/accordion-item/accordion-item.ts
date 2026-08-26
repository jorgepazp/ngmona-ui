import {
  Component,
  ElementRef,
  computed,
  contentChildren,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideChevronDown, LucideDynamicIcon } from '@lucide/angular';
import { UiTemplateDirective } from '../../shared/ui-template.directive';
import { Accordion } from '../accordion';

let nextId = 0;

/**
 * Single entry in a `ui-accordion`. Must be a direct child of `<ui-accordion>` — like
 * `TimelineItem`, renders as `:host { display: contents }` so the parent's layout stays real, and
 * reads/drives its expanded state through the injected parent `Accordion` instead of owning it.
 *
 * The panel stays mounted at all times and animates via a plain CSS `grid-template-rows`
 * transition (0fr collapsed, 1fr expanded) instead of `@if` + `animate.enter`/`animate.leave` like
 * `DropdownMenu`'s panel. That JS-driven approach (measuring `scrollHeight`, animating via the Web
 * Animations API) forces a synchronous layout read right as the animation starts, and rebuilds the
 * projected content from scratch on every toggle — both show up as a visible hitch in an accordion,
 * where a single-open toggle also means a sibling item is animating closed in the same flex column
 * at the same time. The CSS-only version needs neither: `inert` (bound off `expanded`) keeps the
 * collapsed panel out of the tab order and the accessibility tree, matching what removing it from
 * the DOM used to guarantee, with `role="region"` + `aria-labelledby` pointing at the header button,
 * and the header button carries `aria-expanded`/`aria-controls`. Header buttons stay in the normal
 * tab order (per the WAI-ARIA accordion pattern); Up/Down/Home/End additionally move focus between
 * them without changing that order.
 */
@Component({
  selector: 'ui-accordion-item',
  imports: [NgTemplateOutlet, LucideDynamicIcon],
  templateUrl: './accordion-item.html',
  styles: `
    :host {
      display: contents;
    }

    .ui-accordion-panel {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 250ms ease;
    }

    .ui-accordion-panel.expanded {
      grid-template-rows: 1fr;
    }
  `,
})
export class AccordionItem {
  private readonly accordion = inject(Accordion);

  /** Unique identifier for this item, matched against the parent `Accordion`'s `expandedValues`. */
  readonly value = input.required<string>();
  /** Header text shown in the trigger button; ignored when a `uiTemplate="header"` is projected. */
  readonly heading = input('');
  /** Prevents this item's header from being toggled open/closed. */
  readonly disabled = input(false);
  /** Extra utility classes appended to the item's root element. */
  readonly classNames = input('');

  readonly headerRef = viewChild<ElementRef<HTMLButtonElement>>('headerBtn');

  protected readonly chevronIcon = LucideChevronDown;
  protected readonly headerId = `ui-accordion-header-${nextId++}`;
  protected readonly panelId = `ui-accordion-panel-${nextId++}`;

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly headerTemplate = computed(
    () => this.templates().find((t) => t.name() === 'header')?.template,
  );

  protected readonly expanded = computed(() => this.accordion.isExpanded(this.value()));

  protected toggle(): void {
    if (this.disabled()) return;
    this.accordion.toggle(this.value());
  }

  protected onKeydown(event: KeyboardEvent): void {
    this.accordion.onItemKeydown(event, this);
  }
}
