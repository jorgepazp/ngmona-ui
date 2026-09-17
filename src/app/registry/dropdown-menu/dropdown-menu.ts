import {
  Component,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
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
import { FloatingPanel } from '../shared/floating-panel';
import { UiTemplateDirective } from '../shared/ui-template.directive';

/**
 * Trigger button + floating panel, with named `button`/`menu` templates (via `uiTemplate`) for
 * custom trigger content and menu items — falls back to plain text if omitted.
 *
 * Positioned with `FloatingPanel` (flip/shift, repositions on scroll), same as `Popover` and
 * `Combobox` — the panel is rendered through a CDK overlay rather than as a DOM child of the
 * trigger, so it's never clipped or forced into scroll by an overflow/scrolling ancestor.
 *
 * Menu semantics: trigger has `aria-haspopup="menu"` + `aria-expanded`, the panel has
 * `role="menu"`, closes on outside click and Escape (returning focus to the trigger on Escape),
 * and Up/Down/Home/End arrow keys move focus between elements marked `role="menuitem"` inside the
 * panel content the caller provides.
 */
@Component({
  selector: 'ui-dropdown-menu',
  imports: [NgTemplateOutlet],
  templateUrl: './dropdown-menu.html',
  providers: [FloatingPanel],
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
  /** Extra utility classes appended to the floating panel element. */
  readonly classNames = input('');
  /** Accessible label applied to the trigger button. */
  readonly ariaLabel = input('Menu');

  /** Fires whenever the panel finishes opening. */
  readonly opened = output<void>();
  /** Fires whenever the panel finishes closing, however it was closed (toggle, outside click, Escape, Tab). */
  readonly closed = output<void>();
  /** Fires on every trigger click, even when `disableMenu` is `true` and no panel opens. */
  readonly buttonClicked = output<void>();

  private readonly floatingPanel = inject(FloatingPanel);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panelTemplate = viewChild<TemplateRef<unknown>>('panel');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panelRoot');

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly buttonTemplate = computed(
    () => this.templates().find((t) => t.name() === 'button')?.template,
  );
  protected readonly menuTemplate = computed(
    () => this.templates().find((t) => t.name() === 'menu')?.template,
  );

  constructor() {
    // Bridge `open` to FloatingPanel — same pattern as Popover/Combobox.
    effect(() => {
      const isOpen = this.open();
      const trigger = this.triggerRef()?.nativeElement;
      const panel = this.panelTemplate();
      if (!trigger || !panel) return;

      if (isOpen) {
        this.floatingPanel.open(trigger, panel, this.viewContainerRef, { panelClass: this.classNames() });
      } else {
        this.floatingPanel.close();
      }
    });

    // Reflect FloatingPanel closing itself (outside click) back into our own state. Escape is
    // handled and stopped in onPanelKeydown below so it never reaches here, since that path also
    // needs to return focus to the trigger.
    effect(() => {
      if (!this.floatingPanel.isOpen() && this.open()) {
        this.open.set(false);
        this.closed.emit();
      }
    });

    // Move focus onto the first menu item once the panel is actually attached, so arrow-key
    // navigation works immediately without an extra Tab/click.
    effect(() => {
      if (this.floatingPanel.isOpen()) {
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
        // Stop it from also reaching FloatingPanel's own document-level Escape listener — we
        // handle the close ourselves so we can return focus to the trigger, which FloatingPanel's
        // generic close (shared with Popover/Combobox) doesn't do.
        event.stopPropagation();
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
