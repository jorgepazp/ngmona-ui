import { Component, computed, input, output } from '@angular/core';
import { LucideDynamicIcon, LucideX } from '@lucide/angular';

export type NotificationType = 'info' | 'success' | 'error' | 'warning' | 'neutral';
export type NotificationPosition =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

/**
 * Toast-style notification anchored to a corner or edge of the screen.
 *
 * Controlled via `show`, similar to `Modal`: set it back to `false` when `(closed)` fires. `type`
 * sets the icon, color and ARIA role: `error` interrupts, the rest announce politely. Set
 * `stacked` to drop the built-in fixed positioning so a parent, such as `Toaster`, can lay out
 * several notifications itself.
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
        return 'bg-surface-success-light text-surface-success border-surface-success';
      case 'error':
        return 'bg-surface-danger-light text-surface-danger border-surface-danger';
      case 'warning':
        return 'bg-surface-warning-light text-surface-warning border-surface-warning';
      case 'neutral':
        return 'bg-surface-neutral !border-border-neutral text-text-primary';
      case 'info':
      default:
        return 'bg-surface-info-light text-surface-info border-surface-info';
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
