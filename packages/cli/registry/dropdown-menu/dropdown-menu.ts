import {
  Component,
  ElementRef,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { collapseEnter, collapseLeave } from '../shared/animations';
import { UiTemplateDirective } from '../shared/ui-template.directive';

/**
 * Trigger button + floating panel, with named `button`/`menu` templates (via `uiTemplate`) for
 * custom trigger content and menu items — falls back to plain text if omitted.
 *
 * Menu semantics: trigger has `aria-haspopup="menu"` + `aria-expanded`, the panel has
 * `role="menu"`, closes on outside click and Escape (returning focus to the trigger), and
 * Up/Down/Home/End arrow keys move focus between elements marked `role="menuitem"` inside the
 * panel content the caller provides.
 */
@Component({
  selector: 'ui-dropdown-menu',
  imports: [NgTemplateOutlet],
  templateUrl: './dropdown-menu.html',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class DropdownMenu {
  protected readonly collapseEnter = collapseEnter;
  protected readonly collapseLeave = collapseLeave;

  /** Disables the trigger entirely — it no longer responds to clicks and `buttonClicked` never fires. */
  readonly disabled = input(false);
  /** Keeps the trigger clickable (still emits `buttonClicked`) but prevents the panel itself from opening. */
  readonly disableMenu = input(false);
  /** Whether the panel is visible. Two-way bindable via `[(open)]`. */
  readonly open = model(false);
  /** Extra utility classes appended to the trigger button, for one-off overrides. */
  readonly classNames = input('');
  /** Accessible label applied to the trigger button. */
  readonly ariaLabel = input('Menu');

  /** Fires whenever the panel finishes opening. */
  readonly opened = output<void>();
  /** Fires whenever the panel finishes closing, however it was closed (toggle, outside click, Escape, Tab). */
  readonly closed = output<void>();
  /** Fires on every trigger click, even when `disableMenu` is `true` and no panel opens. */
  readonly buttonClicked = output<void>();

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly buttonTemplate = computed(
    () => this.templates().find((t) => t.name() === 'button')?.template,
  );
  protected readonly menuTemplate = computed(
    () => this.templates().find((t) => t.name() === 'menu')?.template,
  );

  constructor() {
    // Move focus onto the first menu item whenever the panel opens, so arrow-key navigation
    // works immediately without an extra Tab/click.
    effect(() => {
      if (this.open()) {
        queueMicrotask(() => {
          const items = this.menuItems();
          (items[0] ?? this.panelRef()?.nativeElement)?.focus();
        });
      }
    });
  }

  protected toggle(): void {
    if (this.disabled()) return;
    this.buttonClicked.emit();
    if (this.disableMenu()) return;
    this.open.update((v) => !v);
    if (this.open()) {
      this.opened.emit();
    } else {
      this.closed.emit();
    }
  }

  protected close(returnFocus = false): void {
    if (!this.open()) return;
    this.open.set(false);
    this.closed.emit();
    if (returnFocus) {
      this.triggerRef()?.nativeElement.focus();
    }
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  protected onPanelKeydown(event: KeyboardEvent): void {
    const items = this.menuItems();
    switch (event.key) {
      case 'ArrowDown': {
        if (items.length === 0) break;
        event.preventDefault();
        const i = items.indexOf(document.activeElement as HTMLElement);
        items[(i + 1 + items.length) % items.length]?.focus();
        break;
      }
      case 'ArrowUp': {
        if (items.length === 0) break;
        event.preventDefault();
        const i = items.indexOf(document.activeElement as HTMLElement);
        items[(i - 1 + items.length) % items.length]?.focus();
        break;
      }
      case 'Home':
        if (items.length === 0) break;
        event.preventDefault();
        items[0]?.focus();
        break;
      case 'End':
        if (items.length === 0) break;
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case 'Escape':
        event.preventDefault();
        this.close(true);
        break;
      case 'Tab':
        this.close();
        break;
    }
  }

  private menuItems(): HTMLElement[] {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return [];
    return Array.from(panel.querySelectorAll<HTMLElement>('[role="menuitem"]'));
  }
}
