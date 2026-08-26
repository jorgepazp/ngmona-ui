import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChildren, effect, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UiTemplateDirective } from '../shared/ui-template.directive';

let nextId = 0;

/**
 * Single-thumb range slider built on the native `<input type="range">` rather than a hand-built
 * div thumb/track pair, so keyboard support (arrow keys, Home/End, Page Up/Down) and touch
 * dragging come for free from the browser. The filled portion of the track is a decorative
 * absolutely-positioned overlay sitting *behind* the (transparent-track) range input — the input
 * itself stays the actual hit target and focusable element throughout.
 *
 * `formatValue` drives both the visible value badge and `aria-valuetext`, for sliders where the
 * raw number alone isn't self-explanatory (e.g. `(v) => `$${v}`` for a currency slider, or a
 * duration formatter). Follows `Input`'s id-generation (`nextId` counter + `id` override) and
 * label/caption `UiTemplateDirective` slot conventions.
 */
@Component({
  selector: 'ui-slider',
  imports: [NgTemplateOutlet],
  templateUrl: './slider.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Slider),
      multi: true,
    },
  ],
})
export class Slider implements ControlValueAccessor {
  /** Current numeric value. Two-way bindable via `[(value)]`. */
  readonly value = model(0);
  /** Minimum allowed value. */
  readonly min = input(0);
  /** Maximum allowed value. */
  readonly max = input(100);
  /** Increment size for keyboard/drag interactions. */
  readonly step = input(1);
  /** Disables dragging/keyboard input and dims the track. */
  readonly disabled = input(false);
  /** Text label rendered above the track; ignored when a `uiTemplate="label"` is projected. */
  readonly label = input('');
  /** Helper text rendered below the track; ignored when a `uiTemplate="caption"` is projected. */
  readonly caption = input('');
  /** Overrides the auto-generated `id` used to associate the label and caption with the input. */
  readonly id = input<string | undefined>(undefined);
  /** Extra utility classes appended to the root element. */
  readonly classNames = input('');
  /** Accessible name for the range input, used only when no visible `label` is set (defaults to `'Slider'`). */
  readonly ariaLabel = input<string | undefined>(undefined);
  /** Shows the current (formatted) value next to the label. */
  readonly showValue = input(true);
  /** Formats the value for the visible badge and `aria-valuetext`. */
  readonly formatValue = input<((value: number) => string) | undefined>(undefined);

  protected readonly generatedId = `ui-slider-${nextId++}`;
  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);
  protected readonly captionId = computed(() => `${this.resolvedId()}-caption`);

  protected readonly percent = computed(() => {
    const range = this.max() - this.min();
    if (range <= 0) return 0;
    return Math.min(100, Math.max(0, ((this.value() - this.min()) / range) * 100));
  });

  protected readonly displayValue = computed(() => {
    const fmt = this.formatValue();
    return fmt ? fmt(this.value()) : `${this.value()}`;
  });

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly labelTemplate = computed(() => this.templates().find((t) => t.name() === 'label')?.template);
  protected readonly captionTemplate = computed(() => this.templates().find((t) => t.name() === 'caption')?.template);

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => this.onChange(this.value()));
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).valueAsNumber);
  }

  protected markTouched(): void {
    this.onTouched();
  }

  writeValue(value: number): void {
    this.value.set(value ?? 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
