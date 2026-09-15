import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChildren, effect, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideDynamicIcon, LucideMinus, LucidePlus } from '@lucide/angular';
import { InputGroup } from '../input-group/input-group';
import { UiTemplateDirective } from '../shared/ui-template.directive';

type NumberInputState = 'success' | 'warning' | 'error' | null;

let nextId = 0;

/**
 * Numeric input with increment and decrement buttons, composed inside `InputGroup`.
 *
 * Clamps the value between `min` and `max`; the corresponding button disables once a limit is
 * reached. `step` sets the amount added or subtracted per button press.
 */
@Component({
  selector: 'ui-number-input',
  imports: [InputGroup, NgTemplateOutlet, LucideDynamicIcon],
  templateUrl: './number-input.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInput),
      multi: true,
    },
  ],
})
export class NumberInput implements ControlValueAccessor {
  /** Current numeric value, or `null` when empty. Two-way bindable via `[(value)]`; also works with `formControlName`/`ngModel`. */
  readonly value = model<number | null>(null);
  /** Minimum allowed value — the decrement button disables and blur clamps the value once reached. */
  readonly min = input<number | undefined>(undefined);
  /** Maximum allowed value — the increment button disables and blur clamps the value once reached. */
  readonly max = input<number | undefined>(undefined);
  /** Amount added or subtracted per +/- button press. */
  readonly step = input(1);
  /** Disables the input and both stepper buttons. */
  readonly disabled = input(false);
  /** Native placeholder text shown when the value is empty. */
  readonly placeholder = input('');
  /** Static label text; ignored when a `uiTemplate="label"` is projected. */
  readonly label = input('');
  /** Static helper/caption text below the input; ignored when a `uiTemplate="caption"` is projected. */
  readonly caption = input('');
  /** Validation state, passed through to the underlying `InputGroup` border color. */
  readonly state = input<NumberInputState>(null);
  /** Overrides the auto-generated element id (used to associate the label and caption). */
  readonly id = input<string | undefined>(undefined);
  /** Extra utility classes appended to the input group. */
  readonly classNames = input('');

  protected readonly minusIcon = LucideMinus;
  protected readonly plusIcon = LucidePlus;

  protected readonly generatedId = `ui-number-input-${nextId++}`;
  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);
  protected readonly captionId = computed(() => `${this.resolvedId()}-caption`);

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  protected readonly canDecrement = computed(() => {
    const min = this.min();
    return !this.isDisabled() && (min === undefined || (this.value() ?? 0) > min);
  });
  protected readonly canIncrement = computed(() => {
    const max = this.max();
    return !this.isDisabled() && (max === undefined || (this.value() ?? 0) < max);
  });

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly labelTemplate = computed(() => this.templates().find((t) => t.name() === 'label')?.template);
  protected readonly captionTemplate = computed(() => this.templates().find((t) => t.name() === 'caption')?.template);

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => this.onChange(this.value()));
  }

  protected onInputEvent(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value === '' ? null : target.valueAsNumber);
  }

  protected onBlurEvent(): void {
    this.onTouched();
    this.value.set(this.clamp(this.value()));
  }

  protected increment(): void {
    if (!this.canIncrement()) return;
    this.value.set(this.clamp((this.value() ?? this.min() ?? 0) + this.step()));
  }

  protected decrement(): void {
    if (!this.canDecrement()) return;
    this.value.set(this.clamp((this.value() ?? this.min() ?? 0) - this.step()));
  }

  private clamp(value: number | null): number | null {
    if (value === null || Number.isNaN(value)) return value;
    const min = this.min();
    const max = this.max();
    let clamped = value;
    if (min !== undefined) clamped = Math.max(min, clamped);
    if (max !== undefined) clamped = Math.min(max, clamped);
    return clamped;
  }

  writeValue(value: number | null): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
