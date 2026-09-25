import { Component, computed, contentChildren, output, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  LucideCircleCheck,
  LucideCircleX,
  LucideDynamicIcon,
  LucideInfo,
  LucideTriangleAlert,
  LucideX,
  type LucideIconInput,
} from '@lucide/angular';
import { UiTemplateDirective } from '../shared/ui-template.directive';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

/**
 * Inline banner for contextual messages within page content, such as a warning above a form.
 * Use `Notification` instead for temporary, toast-like messages.
 *
 * `type` sets the icon, color and ARIA role: `error` uses `role="alert"` to interrupt, the other
 * types use `role="status"`. There is no `open` input; dismissing hides the alert internally and
 * emits `dismissed` so the caller can react, e.g. to remove it from a list.
 */
@Component({
  selector: 'ui-alert',
  imports: [LucideDynamicIcon, NgTemplateOutlet],
  templateUrl: './alert.html',
})
export class Alert {
  /** Semantic type — drives the default icon, color, and the `alert`/`status` ARIA role split (see class doc). */
  readonly type = input<AlertType>('info');
  /** Optional bold heading rendered above the body content. */
  readonly heading = input('');
  /** Overrides the default icon derived from `type`. */
  readonly icon = input<LucideIconInput | undefined>(undefined);
  /** Hides the leading icon entirely when `false`. */
  readonly showIcon = input(true);
  /** Shows a close button that hides the alert when clicked (see the `dismissed` output). */
  readonly dismissible = input(false);
  /** Extra utility classes appended to the root element. */
  readonly classNames = input('');

  /** Fires when the built-in dismiss button is clicked. */
  readonly dismissed = output<void>();

  protected readonly closeIcon = LucideX;
  protected readonly isDismissed = signal(false);

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly actionsTemplate = computed(
    () => this.templates().find((t) => t.name() === 'actions')?.template,
  );

  /** Errors interrupt (`alert`/`assertive`); everything else is announced politely (`status`). */
  protected readonly role = computed(() => (this.type() === 'error' ? 'alert' : 'status'));
  protected readonly ariaLive = computed(() => (this.type() === 'error' ? 'assertive' : 'polite'));

  protected readonly typeIcon = computed<LucideIconInput>(() => {
    const override = this.icon();
    if (override) return override;
    switch (this.type()) {
      case 'success':
        return LucideCircleCheck;
      case 'warning':
        return LucideTriangleAlert;
      case 'error':
        return LucideCircleX;
      case 'info':
      default:
        return LucideInfo;
    }
  });

  protected readonly typeClass = computed(() => {
    switch (this.type()) {
      case 'success':
        return 'bg-surface-success-light border-success-500 text-text-success';
      case 'error':
        return 'bg-surface-danger-light border-danger-500 text-text-danger';
      case 'warning':
        return 'bg-surface-warning-light border-warning-500 text-text-warning';
      case 'info':
      default:
        return 'bg-surface-info-light border-info-500 text-text-info';
    }
  });

  protected readonly alertClass = computed(
    () =>
      `relative flex gap-4 rounded-lg border border-solid !p-6 ${this.typeClass()} ${this.classNames()}`,
  );

  protected dismiss(): void {
    this.isDismissed.set(true);
    this.dismissed.emit();
  }
}
