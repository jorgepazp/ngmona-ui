import { Component, computed, input } from '@angular/core';

type InputGroupState = 'success' | 'warning' | 'error' | null;

/**
 * Layout primitive that visually joins prefix and suffix addons (icons, text, buttons) with a
 * projected input into one bordered unit, for example a currency symbol plus an amount field, or
 * a search box with a "Go" button.
 *
 * Project addons with the `prefix` and `suffix` attributes on either side of the input. The
 * group's border reacts to focus of anything inside it; remove the border and outline from the
 * projected input so only the group's border shows.
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
    const disabledClass = this.disabled() ? 'opacity-60 pointer-events-none bg-surface-neutral ' : '';
    return stateClass + disabledClass;
  });
}
