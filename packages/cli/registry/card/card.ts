import { Component, computed, input } from '@angular/core';

type CardShadow = 'hover' | 'always' | 'none';

/**
 * Plain bordered container with an optional card shadow. Identical across all three source
 * forks, so this is a straight port. Fixed the surface/border classes: the original referenced
 * `bg-color-surface-white` / `border-color-border-neutral`, which aren't real utilities under
 * the new token names (`--color-surface-white`, `--color-border-neutral`) — Tailwind generates
 * `bg-surface-white` / `border-border-neutral` from those, so the intended background/border
 * were silently never applied.
 */
@Component({
  selector: 'ui-card',
  templateUrl: './card.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Card {
  /** Controls when the card's drop shadow appears: `'hover'` only on hover, `'always'` on, or `'none'` never. */
  readonly shadow = input<CardShadow>('hover');
  /** Extra utility classes appended to the card's root element, for one-off layout/spacing overrides. */
  readonly classNames = input('');

  protected readonly shadowClass = computed(() => {
    switch (this.shadow()) {
      case 'always':
        return 'shadow-card';
      case 'none':
        return '';
      case 'hover':
      default:
        return 'hover:shadow-card';
    }
  });
}
