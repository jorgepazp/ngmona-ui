import { Component, computed, contentChildren, effect, forwardRef, input, model, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideCheck, LucideDynamicIcon, LucideMinus } from '@lucide/angular';
import { UiTemplateDirective } from '../shared/ui-template.directive';

/**
 * Checkbox with native forms interop (`ControlValueAccessor`, works with `formControlName`/
 * `ngModel`) and a signal-based `[(checked)]` two-way binding for standalone usage.
 *
 * Fixes carried over from the original: the visible label is now inside the `<label>` element
 * (previously a sibling `<span>`, so clicking the text or reading it via a screen reader never
 * worked), and the change output now fires on every user interaction (previously it only fired
 * from `writeValue`, i.e. programmatic sets — a bug the original left a TODO comment about).
 */
@Component({
  selector: 'ui-checkbox',
  imports: [LucideDynamicIcon, NgTemplateOutlet],
  templateUrl: './checkbox.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Checkbox),
      multi: true,
    },
  ],
})
export class Checkbox implements ControlValueAccessor {
  /** Checked state. Two-way bindable via `[(checked)]`. */
  readonly checked = model(false);
  /** Static label text rendered next to the box; ignored when a `uiTemplate="label"` is projected. */
  readonly label = input('');
  /** Disables the checkbox and applies the disabled visual style. */
  readonly disabled = input(false);
  /** Presentation-only "mixed" visual state (e.g. a "select all" checkbox with a partial selection). Doesn't affect `checked`. */
  readonly indeterminate = input(false);

  protected readonly checkIcon = LucideCheck;
  protected readonly minusIcon = LucideMinus;
  protected readonly ariaChecked = computed(() => (this.indeterminate() ? 'mixed' : this.checked()));

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly labelTemplate = computed(
    () => this.templates().find((t) => t.name() === 'label')?.template,
  );

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => this.onChange(this.checked()));
  }

  protected toggle(event: Event): void {
    this.checked.set((event.target as HTMLInputElement).checked);
  }

  protected markTouched(): void {
    this.onTouched();
  }

  writeValue(value: boolean): void {
    this.checked.set(value ?? false);
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
