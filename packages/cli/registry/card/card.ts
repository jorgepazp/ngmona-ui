import { Component, computed, input } from '@angular/core';

type CardShadow = 'hover' | 'always' | 'none';

/**
 * Plain bordered container with an optional shadow.
 *
 * Use `shadow` to control when the shadow appears: on hover, always, or never.
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
