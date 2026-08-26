import { Component, computed, input, output } from '@angular/core';
import { LucideDynamicIcon, LucideX } from '@lucide/angular';

export type NotificationType = 'info' | 'success' | 'error' | 'warning' | 'neutral';
export type NotificationPosition =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

/**
 * Toast-style notification, positioned fixed to a screen corner/edge. Controlled via `show`, like
 * `Modal` — the caller flips it back to `false` on `closed` instead of the component managing its
 * own visibility.
 *
 * The original drove its slide-in/out with a position-aware `translate-x`/`translate-y` switch
 * timed by an `rxjs` `timer(200)`, mirroring the same choreography bug pattern as the original
 * Modal. That's replaced with a fade animation on the `@if` block's enter/leave via
 * `animate.enter`/`animate.leave`.
 *
 * Multi-brand `type` values (`accent-tbk`/`accent-onepay`/`accent-webpay`/`custom`) are dropped —
 * see `styles.css` for why the brand palette collapsed to a single `primary`/`accent` pair.
 *
 * `hideCloseButton` (default `true`, i.e. no close button unless explicitly turned off) is
 * renamed to `showCloseButton` (default `true`, i.e. shown unless explicitly turned off) to match
 * `Modal`'s naming and drop the double-negative default.
 *
 * `stacked` (default `false`) drops the built-in `fixed`+corner-position classes so a parent can
 * lay several of these out itself — used by `Toaster` (`../toast.ts`) to stack multiple queued
 * toasts in the same corner instead of having them all render on top of each other.
 */
@Component({
  selector: 'ui-notification',
  imports: [LucideDynamicIcon],
  templateUrl: './notification.html',
})
export class Notification {
  /** Controls visibility, like `Modal`'s `open` — the caller flips it back to `false` on `(closed)`. */
  readonly show = input(false);
  /** Semantic/visual style; also drives whether it announces as `alert`/`assertive` (`'error'`) or `status`/`polite` (everything else). */
  readonly type = input<NotificationType>('info');
  /** Screen corner/edge the notification is anchored to. Ignored when `stacked` is `true`. */
  readonly position = input<NotificationPosition>('top-center');
  /** Shows the built-in `X` close button. */
  readonly showCloseButton = input(true);
  /** Extra utility classes appended to the notification. */
  readonly classNames = input('');
  /** Drops the built-in fixed positioning/corner classes so a parent (e.g. `Toaster`) can lay out several instances itself. */
  readonly stacked = input(false);

  /** Emitted when the close button is clicked — the caller should set `show` to `false`. */
  readonly closed = output<void>();

  protected readonly closeIcon = LucideX;

  /** Errors interrupt (`alert`/`assertive`); everything else is announced politely (`status`). */
  protected readonly role = computed(() => (this.type() === 'error' ? 'alert' : 'status'));
  protected readonly ariaLive = computed(() => (this.type() === 'error' ? 'assertive' : 'polite'));

  private readonly typeClass = computed(() => {
    switch (this.type()) {
      case 'success':
        return 'bg-success-100 !border-success-500 text-success-800';
      case 'error':
        return 'bg-danger-100 !border-danger-500 text-danger-800';
      case 'warning':
        return 'bg-warning-100 !border-warning-500 text-warning-800';
      case 'neutral':
        return 'bg-neutral-300 !border-neutral-600 text-neutral-900';
      case 'info':
      default:
        return 'bg-info-100 !border-info-500 text-info-800';
    }
  });

  private readonly positionClass = computed(() => {
    // On mobile every position spans the full width (pinned left-2 + right-2); from `sm:` up it
    // collapses back to a single-edge corner anchor. Preserved from the original.
    switch (this.position()) {
      case 'top-left':
        return 'top-2 left-2 right-2 sm:right-[unset]';
      case 'bottom-left':
        return 'bottom-2 left-2 right-2 sm:right-[unset]';
      case 'bottom-right':
        return 'bottom-2 left-2 right-2 sm:left-[unset]';
      case 'top-right':
        return 'top-2 left-2 right-2 sm:left-[unset]';
      case 'bottom-center':
        return 'bottom-2 left-1/2 -translate-x-1/2';
      case 'top-center':
      default:
        return 'top-2 left-1/2 -translate-x-1/2';
    }
  });

  protected readonly notificationClass = computed(() => {
    const base = `relative rounded-lg border border-solid px-1 py-1 shadow-notification ${
      this.showCloseButton() ? 'pr-5' : ''
    } ${this.typeClass()} ${this.classNames()}`;
    return this.stacked() ? base : `fixed z-[10000] ${this.positionClass()} ${base}`;
  });

  protected close(): void {
    this.closed.emit();
  }
}
