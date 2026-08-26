import { Component, computed, input } from '@angular/core';

export type SeparatorOrientation = 'horizontal' | 'vertical';

/**
 * Thin dividing line. Most separators in a layout are purely presentational (spacing between
 * unrelated blocks), so `decorative` defaults to `true` and the line is `aria-hidden` — assistive
 * tech skips straight over it, same as it would a plain visual rule. Set `decorative` to `false`
 * only when the separator genuinely marks a semantic break between two sections of content; that
 * flips it to `role="separator"` with `aria-orientation` so it's announced.
 */
@Component({
  selector: 'ui-separator',
  template: `<div [class]="separatorClass()" [attr.role]="decorative() ? null : 'separator'" [attr.aria-orientation]="decorative() ? null : orientation()" [attr.aria-hidden]="decorative() ? 'true' : null"></div>`,
})
export class Separator {
  /** Line direction. `'vertical'` requires the parent to give it an explicit height (e.g. `flex items-stretch`). */
  readonly orientation = input<SeparatorOrientation>('horizontal');
  /** Whether the separator is purely visual (`aria-hidden`) vs. a semantic `role="separator"` — see class doc. */
  readonly decorative = input(true);
  /** Extra utility classes appended after the base line styles. */
  readonly classNames = input('');

  protected readonly separatorClass = computed(() => {
    const base = this.orientation() === 'vertical' ? 'w-px h-full self-stretch' : 'h-px w-full';
    return `shrink-0 bg-divider ${base} ${this.classNames()}`;
  });
}
