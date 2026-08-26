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
 * Inline, static banner — unlike `Notification`, this isn't fixed-position/toast-like, it's meant
 * to sit directly in page content (e.g. above a form). Uncontrolled: dismissing hides it via an
 * internal signal (no `open`/`show` input to wire up for the common case), but a `dismissed`
 * output is still emitted so a caller can react (e.g. remove it from a list).
 *
 * `type` drives both the icon and the color, same pattern as `Notification`, and the same
 * `alert`/`status` role split: `error` interrupts (`role="alert"`), everything else is announced
 * politely (`role="status"`) since it doesn't need to steal focus to be noticed.
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
        return 'bg-success-100 !border-success-500 text-success-800';
      case 'error':
        return 'bg-danger-100 !border-danger-500 text-danger-800';
      case 'warning':
        return 'bg-warning-100 !border-warning-500 text-warning-800';
      case 'info':
      default:
        return 'bg-info-100 !border-info-500 text-info-800';
    }
  });

  protected readonly alertClass = computed(
    () =>
      `relative flex gap-2 rounded-lg border border-solid !p-3 ${this.typeClass()} ${this.classNames()}`,
  );

  protected dismiss(): void {
    this.isDismissed.set(true);
    this.dismissed.emit();
  }
}
