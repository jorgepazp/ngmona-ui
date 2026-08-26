import { Component, contentChildren, input, model } from '@angular/core';
import { AccordionItem } from './accordion-item/accordion-item';

/**
 * Wraps `ui-accordion-item` children (like `Timeline`/`TimelineItem`). Coordination between the
 * parent and its items — which value(s) are expanded, single-vs-multiple-open, and Up/Down/Home/
 * End navigation between headers — is done by each `AccordionItem` injecting this component
 * directly (`inject(Accordion)`), the same way `Checkbox`/`Radio` inject `NG_VALUE_ACCESSOR`
 * machinery, just without the forms indirection since there's no `ControlValueAccessor` need here.
 *
 * `expandedValues` is a `model<string[]>` so the whole open/closed set can be bound with
 * `[(expandedValues)]` for a fully controlled accordion, or left uncontrolled (defaults to `[]`).
 */
@Component({
  selector: 'ui-accordion',
  templateUrl: './accordion.html',
})
export class Accordion {
  /** Value(s) of the currently expanded item(s). Two-way bindable via `[(expandedValues)]`; defaults to none open. */
  readonly expandedValues = model<string[]>([]);
  /** Allow more than one item open at a time. */
  readonly multiple = input(false);
  /** In single-open mode, whether clicking the open item's header closes it again. */
  readonly collapsible = input(true);
  /** Extra utility classes appended to the root element. */
  readonly classNames = input('');

  private readonly items = contentChildren(AccordionItem);

  isExpanded(value: string): boolean {
    return this.expandedValues().includes(value);
  }

  toggle(value: string): void {
    const current = this.expandedValues();
    const isOpen = current.includes(value);

    if (this.multiple()) {
      this.expandedValues.set(isOpen ? current.filter((v) => v !== value) : [...current, value]);
      return;
    }

    if (isOpen) {
      this.expandedValues.set(this.collapsible() ? [] : current);
    } else {
      this.expandedValues.set([value]);
    }
  }

  onItemKeydown(event: KeyboardEvent, item: AccordionItem): void {
    const items = this.items();
    const index = items.indexOf(item);
    if (index === -1) return;

    let nextIndex: number | null = null;
    switch (event.key) {
      case 'ArrowDown':
        nextIndex = (index + 1) % items.length;
        break;
      case 'ArrowUp':
        nextIndex = (index - 1 + items.length) % items.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = items.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    items[nextIndex]?.headerRef()?.nativeElement.focus();
  }
}
