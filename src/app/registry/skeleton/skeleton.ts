import { Component, input } from '@angular/core';

/** Pulsing placeholder for content that hasn't loaded yet. Purely decorative — `aria-hidden`. */
@Component({
  selector: 'ui-skeleton',
  template: `<div class="animate-pulse rounded bg-neutral-500" [class]="classNames()" [style.width]="width()" [style.height]="height()" aria-hidden="true"></div>`,
})
export class Skeleton {
  /** CSS width of the placeholder block (any valid CSS length, e.g. `'40px'`, `'60%'`). */
  readonly width = input('100%');
  /** CSS height of the placeholder block. */
  readonly height = input('1rem');
  /** Extra utility classes, e.g. `'rounded-full'` for an avatar-shaped placeholder. */
  readonly classNames = input('');
}
