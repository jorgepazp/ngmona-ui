import { Component, computed, input } from '@angular/core';
import { LucideDynamicIcon, type LucideIconInput } from '@lucide/angular';

export type BadgeVariant = 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';

/**
 * Small status/label pill. `primary` and `neutral` render solid (they have no near-white tint in
 * the palette to pair with dark text); the status variants (`success`/`warning`/`danger`/`info`)
 * use the dedicated `--color-surface-*-light` / `--color-text-*` token pairs, which is exactly
 * what that semantic pair exists for — a legible light-bg/dark-text combination without hand
 * -computing opacity tricks.
 *
 * Badges are text-first by convention (never color alone) so no extra ARIA is needed for the
 * common case. When a badge stands in for a count/status on another element with no visible
 * text of its own, pass `ariaLabel` to give it an accessible name.
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
      neutral: 'bg-neutral-500 text-text-primary',
      success: 'bg-surface-success-light text-text-success',
      warning: 'bg-surface-warning-light text-text-warning',
      danger: 'bg-surface-danger-light text-text-danger',
      info: 'bg-surface-info-light text-text-info',
    };
    return map[this.variant()];
  }
}
