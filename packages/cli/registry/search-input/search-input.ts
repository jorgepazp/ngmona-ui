import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  DestroyRef,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideDynamicIcon, LucideSearch, LucideX } from '@lucide/angular';
import { UiTemplateDirective } from '../shared/ui-template.directive';

let nextId = 0;

/**
 * Search box with a leading search icon and a clear button that appears once there's text.
 *
 * `search` emits the current value `debounceMs` after the user stops typing. Clearing emits
 * immediately, bypassing the debounce.
 */
@Component({
  selector: 'ui-search-input',
  imports: [NgTemplateOutlet, LucideDynamicIcon],
  templateUrl: './search-input.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInput),
      multi: true,
    },
  ],
})
export class SearchInput implements ControlValueAccessor {
  /** Current text value. Two-way bindable via `[(value)]`; also works with `formControlName`/`ngModel`. */
  readonly value = model('');
  /** Placeholder text shown when empty. */
  readonly placeholder = input('Search…');
  /** Static label text; ignored when a `uiTemplate="label"` is projected. */
  readonly label = input('');
  /** Static helper text below the input; ignored when a `uiTemplate="caption"` is projected. */
  readonly caption = input('');
  /** Disables user interaction. */
  readonly disabled = input(false);
  /** Native `id` for the `<input>`; auto-generated when omitted. */
  readonly id = input<string | undefined>(undefined);
  /** Extra utility classes appended to the input wrapper. */
  readonly classNames = input('');
  /** Accessible name for the input, used when there's no visible `label`. */
  readonly ariaLabel = input('Search');
  /** Debounce delay (ms) before `search` fires after the value settles. */
  readonly debounceMs = input(300);

  /** Debounced value, `debounceMs` after the user stops typing (fires immediately on clear). */
  readonly search = output<string>();

  protected readonly searchIcon = LucideSearch;
  protected readonly clearIcon = LucideX;

  protected readonly generatedId = `ui-search-input-${nextId++}`;
  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);
  protected readonly captionId = computed(() => `${this.resolvedId()}-caption`);

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly labelTemplate = computed(() => this.templates().find((t) => t.name() === 'label')?.template);
  protected readonly captionTemplate = computed(() => this.templates().find((t) => t.name() === 'caption')?.template);

  private readonly destroyRef = inject(DestroyRef);
  private debounceTimer?: ReturnType<typeof setTimeout>;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      const current = this.value();
      this.onChange(current);
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.search.emit(current), this.debounceMs());
    });
    this.destroyRef.onDestroy(() => clearTimeout(this.debounceTimer));
  }

  protected onInputEvent(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected markTouched(): void {
    this.onTouched();
  }

  protected clear(): void {
    clearTimeout(this.debounceTimer);
    this.value.set('');
    this.search.emit('');
  }

  writeValue(value: string | null): void {
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
