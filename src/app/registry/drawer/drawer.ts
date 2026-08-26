import {
  Component,
  ElementRef,
  computed,
  contentChildren,
  effect,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideDynamicIcon, LucideX } from '@lucide/angular';
import { UiTemplateDirective } from '../shared/ui-template.directive';
import { fadeEnterClass, fadeLeaveClass } from '../shared/animations';

type DrawerSide = 'left' | 'right';

/**
 * Slide-in drawer/panel overlay with an optional backdrop, opened from the left or right edge.
 * Supports named `header`/`content`/`footer` templates (via `uiTemplate`) with `<ng-content>` as
 * the default body when no `content` template is supplied.
 *
 * Behaves as a modal dialog: `role="dialog"`, `aria-modal`, closes on Escape, traps Tab focus
 * within the panel while open, and moves focus into the panel on open.
 *
 * Renamed from `Sidebar`: this is an overlay panel (backdrop, opens on top of the page), not the
 * persistent responsive navigation layout — that's the separate `Sidebar` component
 * (`../sidebar/sidebar`), which composes this one internally for its mobile off-canvas nav.
 *
 * The original component faked its slide-in/out with manual `timer(0)`/`timer(200)` RxJS calls
 * that toggled CSS classes: opening relied on a `timer(0)` macrotask landing before the next paint
 * (fragile — intermittently skips the transition), and closing unmounted the panel via `*ngIf`
 * after a hardcoded 200ms timeout while the panel's own CSS class declared a 500ms transition, so
 * a close would visibly jump/cut the animation short. `animate.enter`/`animate.leave` replace both
 * hacks: they trigger off real DOM insertion/removal and the `@if` block won't unmount the view
 * until the leave animation actually finishes. `disableAnimations` is implemented by binding
 * `undefined` in place of an animation class (the native API's `animate.enter`/`animate.leave`
 * classes accept a dynamic value), since there's no per-subtree animation-disable binding like the
 * old engine's `[@.disabled]`.
 */
@Component({
  selector: 'ui-drawer',
  imports: [NgTemplateOutlet, LucideDynamicIcon],
  templateUrl: './drawer.html',
})
export class Drawer {
  /** Open/closed state. Two-way bindable via `[(open)]`. */
  readonly open = model(false);
  /** Edge the panel slides in from. */
  readonly side = input<DrawerSide>('right');
  /** Whether a dimming backdrop renders behind the panel while open. */
  readonly backdrop = input(true);
  /** Whether clicking the backdrop closes the panel. Ignored when `backdrop` is `false`. */
  readonly closeOnBackdrop = input(true);
  /** Whether the built-in close (X) button renders in the panel header. */
  readonly showCloseButton = input(true);
  /** Skips the slide/fade transitions — useful for tests or reduced-motion setups. */
  readonly disableAnimations = input(false);
  /** Extra utility classes appended to the panel element. */
  readonly classNames = input('');
  /** Accessible name for the panel's `role="dialog"`. */
  readonly ariaLabel = input('Drawer');

  /** Fires once the panel has fully closed (after any close animation completes). */
  readonly closed = output<void>();

  protected readonly closeIcon = LucideX;

  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

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

  protected readonly backdropEnterClass = computed(() =>
    this.disableAnimations() ? undefined : fadeEnterClass,
  );
  protected readonly backdropLeaveClass = computed(() =>
    this.disableAnimations() ? undefined : fadeLeaveClass,
  );
  protected readonly panelEnterClass = computed(() => {
    if (this.disableAnimations()) return undefined;
    return this.side() === 'right' ? 'ui-anim-slide-in-right' : 'ui-anim-slide-in-left';
  });
  protected readonly panelLeaveClass = computed(() => {
    if (this.disableAnimations()) return undefined;
    return this.side() === 'right' ? 'ui-anim-slide-out-right' : 'ui-anim-slide-out-left';
  });

  protected readonly panelClass = computed(() => {
    const anchor = this.side() === 'right' ? 'right-0 sm:rounded-l-2xl' : 'left-0 sm:rounded-r-2xl';
    return `fixed inset-y-0 ${anchor} z-10 flex flex-col w-full sm:w-[380px] max-w-full bg-surface-white shadow-hover px-4 py-5 max-h-dvh overflow-y-auto ${this.classNames()}`;
  });

  constructor() {
    // Move focus into the panel whenever it opens, so keyboard/screen-reader users land inside
    // the dialog instead of it silently appearing behind them.
    effect(() => {
      if (this.open()) {
        queueMicrotask(() => this.panelRef()?.nativeElement.focus());
      }
    });
  }

  protected close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.closed.emit();
  }

  protected onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.close();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.close();
      return;
    }
    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
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
