import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChildren,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideDynamicIcon, LucideEye, LucideEyeOff, LucideX, type LucideIconInput } from '@lucide/angular';
import { UiTemplateDirective } from '../shared/ui-template.directive';

type InputType = 'text' | 'number' | 'password';
type InputState = 'success' | 'warning' | 'error' | null;

let nextId = 0;

/**
 * Text input with label and caption slots, a leading or trailing icon, a password visibility
 * toggle, validation states, and an optional inline suggestion dropdown.
 *
 * Set `type="password"` to add a show/hide toggle button, or `type="number"` to restrict typed
 * characters to digits. Use `searchIn` to show a filterable list of suggestions below the field
 * as the user types; navigate it with Arrow Up/Down, Enter and Escape.
 */
@Component({
  selector: 'ui-input',
  imports: [LucideDynamicIcon, NgTemplateOutlet],
  templateUrl: './input.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
})
export class Input implements ControlValueAccessor {
  /** Current field value. Two-way bindable via `[(value)]`; also wired up for `formControlName`/`ngModel`. */
  readonly value = model<string | number | null>(null);
  /** Native `type` — `'password'` adds the show/hide toggle button, `'number'` restricts typed characters to digits. */
  readonly type = input<InputType>('text');
  /** Disables the field and its clear/password-toggle buttons. */
  readonly disabled = input(false);
  /** Native placeholder text shown when the field is empty. */
  readonly placeholder = input('');
  /** Label rendered above the field; ignored when a `uiTemplate="label"` is projected. */
  readonly label = input('');
  /** Validation state — colors the border/icon and, for `'error'`, sets `aria-invalid`; `null` for the neutral default. */
  readonly state = input<InputState>(null);
  /** Icon shown inside the field, positioned per `iconPos`. */
  readonly icon = input<LucideIconInput | undefined>(undefined);
  /** Side the `icon` renders on. */
  readonly iconPos = input<'left' | 'right'>('right');
  /** DOM id for the `<input>`; auto-generated when omitted. */
  readonly id = input<string | undefined>(undefined);
  /** Extra utility classes appended to the field's root element, for one-off overrides. */
  readonly classNames = input('');
  /** Helper/error text rendered below the field and linked via `aria-describedby`; ignored when a `uiTemplate="caption"` is projected. */
  readonly caption = input('');
  /** Candidate strings for the inline suggestion dropdown, filtered against the current `value` as the user types. `null` disables suggestions entirely. */
  readonly searchIn = input<string[] | null>(null);
  /** Native `max` attribute, for `type="number"`. */
  readonly max = input<number | undefined>(undefined);
  /** Native `min` attribute, for `type="number"`. */
  readonly min = input<number | undefined>(undefined);
  /** Native `maxlength` attribute. */
  readonly maxLength = input<number | undefined>(undefined);
  /** Native `minlength` attribute. */
  readonly minLength = input<number | undefined>(undefined);
  /** Native `pattern` attribute used for HTML5 form validation. */
  readonly pattern = input<string | undefined>(undefined);
  /** Marks the field as required for HTML5 form validation. */
  readonly required = input(false);
  /** Characters allowed while typing (tested against `KeyboardEvent.key`), not a format validator. */
  readonly charRegex = input<RegExp | undefined>(undefined);

  /** Fires when the field gains focus. */
  readonly focused = output<FocusEvent>();
  /** Fires when the field loses focus. */
  readonly blurred = output<FocusEvent>();

  protected readonly clearIcon = LucideX;
  protected readonly eyeIcon = LucideEye;
  protected readonly eyeOffIcon = LucideEyeOff;

  protected readonly generatedId = `ui-input-${nextId++}`;
  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);
  protected readonly captionId = computed(() => `${this.resolvedId()}-caption`);

  protected readonly showPassword = signal(false);
  protected readonly hasFocus = signal(false);
  protected hoveringSuggestions = false;

  protected readonly resolvedType = computed<string>(() =>
    this.type() !== 'password' ? this.type() : this.showPassword() ? 'text' : 'password',
  );

  protected readonly suggestions = computed(() => {
    const list = this.searchIn();
    if (!list) return null;
    const val = this.value();
    return val ? list.filter((x) => x.includes(`${val}`)) : list;
  });

  protected readonly showSuggestions = computed(
    () => this.hasFocus() && !!this.searchIn() && (this.suggestions()?.length ?? 0) > 0,
  );

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly labelTemplate = computed(() => this.templates().find((t) => t.name() === 'label')?.template);
  protected readonly captionTemplate = computed(() => this.templates().find((t) => t.name() === 'caption')?.template);

  private onChange: (value: string | number | null) => void = () => {};
  private onTouched: () => void = () => {};

  protected onInputEvent(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
    this.onChange(this.value());
  }

  protected onFocus(event: FocusEvent): void {
    this.hasFocus.set(true);
    this.focused.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
    if (this.hoveringSuggestions) return;
    setTimeout(() => this.hasFocus.set(false), 150);
  }

  protected clearInput(): void {
    this.value.set('');
    this.onChange('');
    this.hasFocus.set(false);
  }

  protected selectSuggestion(item: string): void {
    this.value.set(item);
    this.onChange(item);
    this.hasFocus.set(false);
    this.hoveringSuggestions = false;
  }

  protected avoidUnwantedChars(event: KeyboardEvent): boolean {
    if (this.type() === 'number') return true;
    const regex = this.charRegex();
    return regex ? regex.test(event.key) : true;
  }

  writeValue(value: string | number | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
