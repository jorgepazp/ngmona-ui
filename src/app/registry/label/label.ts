import { Component, computed, input } from '@angular/core';

type LabelColor = 'normal' | 'highlight';

/**
 * Small pill-shaped tag/badge. Identical logic across all three forks. The original shipped a
 * sibling `label.component.css` with `@apply`-based classes (`.info-label`, `.success-label`,
 * `.warning-label`, `.danger-label`, `.tbk-label`, `.tbk-label-generic`) that were never
 * referenced by the template (`getColorClass()` only ever returned `bg-warning-300` or
 * `bg-neutral-500`) — dead code, dropped entirely. `.tbk-label` also referenced `bg-transbank-300`,
 * a class that doesn't exist in any Tailwind config in any of the three forks. `mb-0` (added by
 * FTD/uiSDP, missing from base) is kept to stop the label from picking up a stray bottom margin.
 */
@Component({
  selector: 'ui-label',
  templateUrl: './label.html',
})
export class Label {
  /** Visual color scheme — `'highlight'` renders on a warning-tinted background, `'normal'` on neutral gray. */
  readonly color = input<LabelColor>('normal');

  protected readonly colorClass = computed(() =>
    this.color() === 'highlight' ? 'bg-warning-300' : 'bg-neutral-500',
  );
}
