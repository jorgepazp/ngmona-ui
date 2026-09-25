import { Component, computed, input } from '@angular/core';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info';

/**
 * Horizontal progress bar. Omit `value` (or pass `undefined`) for an indeterminate state — a
 * looping bar animation and no `aria-valuenow` (per the ARIA `progressbar` pattern, omitting
 * `aria-valuenow` is how you signal "progress can't currently be measured").
 */
@Component({
  selector: 'ui-progress',
  templateUrl: './progress.html',
  styles: `
    :host {
      display: contents;
    }
    .ui-progress-indeterminate {
      width: 40%;
      animation: ui-progress-slide 1.2s ease-in-out infinite;
    }
    @keyframes ui-progress-slide {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(250%);
      }
    }
  `,
})
export class Progress {
  /** Current progress amount, out of `max`. Omit (or pass `undefined`) for an indeterminate bar — see class doc. */
  readonly value = input<number | undefined>(undefined);
  /** Value that represents 100% completion. */
  readonly max = input(100);
  /** Track/fill thickness. */
  readonly size = input<ProgressSize>('md');
  /** Color of the fill, e.g. to signal a success/warning/danger state. */
  readonly variant = input<ProgressVariant>('primary');
  /** Accessible name for the `progressbar` element. */
  readonly ariaLabel = input<string | undefined>(undefined);
  /** Overrides the announced value text, e.g. `"3 of 5 steps"`, instead of the raw percentage. */
  readonly valueText = input<string | undefined>(undefined);
  /** Extra utility classes appended to the track element. */
  readonly classNames = input('');

  protected readonly indeterminate = computed(() => this.value() === undefined);

  protected readonly percent = computed(() => {
    const value = this.value();
    if (value === undefined) return 0;
    const max = this.max() || 100;
    return Math.min(100, Math.max(0, (value / max) * 100));
  });

  protected readonly trackClass = computed(() => {
    const size: Record<ProgressSize, string> = { sm: 'h-2', md: 'h-3', lg: 'h-4' };
    return `relative w-full overflow-hidden rounded-full bg-surface-light ${size[this.size()]} ${this.classNames()}`;
  });

  protected readonly fillClass = computed(() => {
    const variant: Record<ProgressVariant, string> = {
      primary: 'bg-primary-500',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      danger: 'bg-danger-500',
      info: 'bg-info-500',
    };
    const shape = this.indeterminate() ? 'absolute inset-y-0 left-0 rounded-full ui-progress-indeterminate' : 'h-full rounded-full transition-all duration-300 ease-out';
    return `${shape} ${variant[this.variant()]}`;
  });
}
