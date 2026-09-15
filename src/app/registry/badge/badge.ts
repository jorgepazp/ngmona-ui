import { Component, computed, input } from '@angular/core';
import { LucideDynamicIcon, type LucideIconInput } from '@lucide/angular';

export type BadgeVariant = 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';

/**
 * Small label used to show a status, category or count.
 *
 * `primary` and `neutral` render with a solid background. The status variants (`success`,
 * `warning`, `danger`, `info`) render with a light background and matching text color. When a
 * badge conveys meaning without its own visible text, such as a bare status dot, pass `ariaLabel`
 * to give it an accessible name.
 */
@Component({
  selector: 'ui-badge',
  imports: [LucideDynamicIcon],
  templateUrl: './badge.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class Badge {
  /** Color variant. */
  readonly variant = input<BadgeVariant>('neutral');
  /** Overall size. */
  readonly size = input<BadgeSize>('md');
  /** Optional leading icon. */
  readonly icon = input<LucideIconInput | undefined>(undefined);
  /** Fully rounded pill shape when `true` (default); a smaller corner radius when `false`. */
  readonly pill = input(true);
  /** Accessible name for badges that convey meaning without their own visible text (e.g. a bare status dot). */
  readonly ariaLabel = input<string | undefined>(undefined);
  /** Extra utility classes appended to the root element. */
  readonly classNames = input('');

  protected readonly badgeClass = computed(() => {
    const base = `inline-flex items-center gap-0.5 font-medium w-fit whitespace-nowrap ${this.shapeClass()} ${this.sizeClass()} ${this.variantClass()}`;
    return `${base} ${this.classNames()}`;
  });

  private shapeClass(): string {
    return this.pill() ? 'rounded-full' : 'rounded';
  }

  private sizeClass(): string {
    return this.size() === 'sm' ? 'text-caption px-1 py-0.5' : 'text-label-xs px-1.5 py-0.5';
  }

  private variantClass(): string {
    const map: Record<BadgeVariant, string> = {
      primary: 'bg-primary-500 text-white',
      neutral: 'bg-surface-medium text-text-primary',
      success: 'bg-surface-success-light text-text-success',
      warning: 'bg-surface-warning-light text-text-warning',
      danger: 'bg-surface-danger-light text-text-danger',
      info: 'bg-surface-info-light text-text-info',
    };
    return map[this.variant()];
  }
}
