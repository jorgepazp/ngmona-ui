import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChildren, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UiTemplateDirective } from '../shared/ui-template.directive';

let nextId = 0;

/**
 * Multi-line text input with native forms interop (`ControlValueAccessor`, works with
 * `formControlName`/`ngModel`) and a signal-based `[(value)]` two-way binding for standalone
 * usage. Shows a live character counter under the field whenever `maxLength` is set and no
 * `caption`/caption template is provided.
 */
@Component({
  selector: 'ui-textarea',
  imports: [NgTemplateOutlet],
  templateUrl: './textarea.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Textarea),
      multi: true,
    },
  ],
})
export class Textarea implements ControlValueAccessor {
  /** Current text. Two-way bindable via `[(value)]`. */
  readonly value = model('');
  /** Disables the field and marks it as disabled for `ControlValueAccessor` consumers. */
  readonly disabled = input(false);
  /** Placeholder text shown in the field when empty. */
  readonly placeholder = input('');
  /** Static label text shown above the field; ignored when a `uiTemplate="label"` is projected. */
  readonly label = input('');
  /** Static caption text shown below the field; ignored when a `uiTemplate="caption"` is projected. */
  readonly caption = input('');
  /** Overrides the auto-generated id used to link the `<label for>` and `aria-describedby`. */
  readonly id = input<string | undefined>(undefined);
  /** Extra utility classes appended to the `<textarea>` element, for one-off overrides. */
  readonly classNames = input('');
  /** Enforces the native `maxlength` attribute and, when set, shows a "current / max" character counter. */
  readonly maxLength = input<number | undefined>(undefined);

  protected readonly generatedId = `ui-textarea-${nextId++}`;
  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);
  protected readonly captionId = computed(() => `${this.resolvedId()}-caption`);
  protected readonly characterCount = computed(() => this.value()?.length ?? 0);

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly labelTemplate = computed(() => this.templates().find((t) => t.name() === 'label')?.template);
  protected readonly captionTemplate = computed(() => this.templates().find((t) => t.name() === 'caption')?.template);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  protected onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  protected markTouched(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
