import { Component, computed, effect, forwardRef, input, model, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * A single native radio input with forms interop (`ControlValueAccessor`) plus a signal-based
 * `[(checked)]` binding. Group several by giving them the same `name`.
 */
@Component({
  selector: 'ui-radio',
  templateUrl: './radio.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Radio),
      multi: true,
    },
  ],
})
export class Radio<T = unknown> implements ControlValueAccessor {
  /** Checked state. Two-way bindable via `[(checked)]`. */
  readonly checked = model(false);
  /** Value emitted via `selected` when this radio becomes checked. */
  readonly value = input<T | undefined>(undefined);
  /** Static label text rendered next to the radio input. */
  readonly label = input('');
  /** Native `name` attribute — radios sharing a `name` form a mutually-exclusive group. */
  readonly name = input('');
  /** Disables user interaction. */
  readonly disabled = input(false);
  /** Accessible name to use when there's no visible `label` (e.g. a radio used on its own in a compact row). */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** Emits this radio's `value` when it becomes checked via user interaction. */
  readonly selected = output<T | undefined>();

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => this.onChange(this.checked()));
  }

  protected onInput(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checked.set(isChecked);
    if (isChecked) {
      this.selected.emit(this.value());
    }
  }

  protected markTouched(): void {
    this.onTouched();
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
