import {
  Component,
  ElementRef,
  computed,
  contentChildren,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideDynamicIcon, LucideX } from '@lucide/angular';
import { UiTemplateDirective } from '../shared/ui-template.directive';

let nextId = 0;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Dialog that displays content in a layer above the page, blocking interaction with the rest
 * of the UI until dismissed. Use it for confirmations, forms, or any content that needs the
 * user's full attention.
 *
 * `open` is controlled by the caller: bind it to a signal and set it back to `false` when
 * `(closed)` fires. Content can be projected directly, or split into `header`, `content` and
 * `footer` sections with `uiTemplate` for full control over each region.
 *
 * Focus is trapped inside the panel while open (Tab/Shift+Tab wrap at the panel edges) and
 * restored to the element that opened the modal once it closes.
 */
@Component({
  selector: 'ui-modal',
  imports: [NgTemplateOutlet, LucideDynamicIcon],
  templateUrl: './modal.html',
})
export class Modal {
  /** Controls visibility. Owned by the caller — the modal never mutates it itself; flip it back to `false` on `(closed)`. */
  readonly open = input(false);
  /** Text rendered in the panel's header and linked via `aria-labelledby`; ignored when a `uiTemplate="header"` is projected. */
  readonly heading = input('');
  /** Whether clicking the backdrop overlay closes the modal. */
  readonly closeOnBackdrop = input(true);
  /** Shows the built-in `X` close button in the top-right corner. */
  readonly showCloseButton = input(true);
  /** Extra utility classes appended to the panel. */
  readonly classNames = input('');
  /** ARIA role of the panel. `AlertDialog` overrides this to `'alertdialog'`. */
  readonly role = input<'dialog' | 'alertdialog'>('dialog');
  /** Id of an element (typically a description/message paragraph) to expose via `aria-describedby`. */
  readonly describedBy = input<string | undefined>(undefined);

  /** Emitted when the modal requests to close (backdrop click, close button, or Escape) — the caller should set `open` to `false`. */
  readonly closed = output<void>();

  protected readonly closeIcon = LucideX;
  protected readonly titleId = `ui-modal-title-${nextId++}`;

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly headerTemplate = computed(
    () => this.templates().find((t) => t.name() === 'header')?.template,
  );
  protected readonly contentTemplate = computed(
    () => this.templates().find((t) => t.name() === 'content')?.template,
  );
  protected readonly footerTemplate = computed(
    () => this.templates().find((t) => t.name() === 'footer')?.template,
  );

  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private previouslyFocused: HTMLElement | null = null;

  constructor() {
    // Focus management: move focus into the panel when it appears, restore it on close.
    effect(() => {
      const panel = this.panelRef()?.nativeElement;
      if (this.open() && panel) {
        this.previouslyFocused ??= document.activeElement as HTMLElement | null;
        panel.focus();
      } else if (!this.open() && this.previouslyFocused) {
        this.previouslyFocused.focus();
        this.previouslyFocused = null;
      }
    });
  }

  protected close(): void {
    this.closed.emit();
  }

  protected onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.close();
    }
  }

  protected onKeydownTab(event: Event): void {
    if (!(event instanceof KeyboardEvent)) return;
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return;

    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
