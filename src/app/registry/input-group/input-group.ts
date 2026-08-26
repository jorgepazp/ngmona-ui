import { Component, computed, input } from '@angular/core';

type InputGroupState = 'success' | 'warning' | 'error' | null;

/**
 * Layout primitive that visually joins prefix/suffix addons (icons, text, buttons) with a
 * projected input into one bordered unit — e.g. `$` + amount + `.00`, or a search box + "Go"
 * button. It is *not* a form control: it carries no value, implements no `ControlValueAccessor`,
 * and needs no special ARIA beyond whatever the projected children already provide.
 *
 * Border/focus styling reacts to the focus state of anything inside the group via
 * `:focus-within`, so the projected control doesn't need its own border/outline — strip those off
 * (see the docs page for the exact classes) so only the group's border shows.
 *
 * Addons are plain content projection rather than named `UiTemplateDirective` slots: `[prefix]`/
 * `[suffix]` attribute selectors are simpler for "arbitrary markup on either side of an input" and
 * don't need the indirection of a named `<ng-template>`.
 */
@Component({
  selector: 'ui-input-group',
  templateUrl: './input-group.html',
})
export class InputGroup {
  /** Dims the group and disables pointer interaction with everything projected inside it. */
  readonly disabled = input(false);
  /** Validation state — tints the border success/warning/error; `null` for the neutral default. */
  readonly state = input<InputGroupState>(null);
  /** Extra utility classes appended to the wrapper. */
  readonly classNames = input('');

  protected readonly wrapperClass = computed(() => {
    const state = this.state();
    const stateClass =
      state === 'success'
        ? 'focus-within:!border-success-500 '
        : state === 'warning'
          ? 'focus-within:!border-warning-500 '
          : state === 'error'
            ? '!border-danger-500 focus-within:!border-danger-500 '
            : '';
    const disabledClass = this.disabled() ? 'opacity-60 pointer-events-none bg-surface-disabled ' : '';
    return stateClass + disabledClass;
  });
}
