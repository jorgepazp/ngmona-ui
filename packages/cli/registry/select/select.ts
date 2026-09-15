import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChildren,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideCheck, LucideChevronDown, LucideDynamicIcon, LucideX } from '@lucide/angular';
import { UiTemplateDirective } from '../shared/ui-template.directive';

let nextId = 0;

/**
 * Single or multi-select with a custom dropdown listbox.
 *
 * Set `multi` to allow selecting more than one option; `value` then holds an array of extracted
 * `optionValue`s instead of the whole option. Options can be plain values or objects; when using
 * objects, set `optionLabel`, `optionValue` and `optionDisabledKey` to the property names to read
 * from each. Use `maxSelectableLimit` to cap how many options can be selected in `multi` mode.
 */
@Component({
  selector: 'ui-select',
  imports: [NgTemplateOutlet, LucideDynamicIcon, LucideCheck],
  templateUrl: './select.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
})
export class Select implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef);

  /** Options rendered in the listbox — plain values, or objects keyed by `optionLabel`/`optionValue`/`optionDisabledKey`. */
  readonly options = input<readonly unknown[]>([]);
  /** Enables multi-select: `value` becomes an array of extracted `optionValue`s instead of a single option — see the `value` doc. */
  readonly multi = input(false);
  /** Text shown in the trigger when nothing is selected. */
  readonly placeholder = input('');
  /** Static label text; ignored when a `uiTemplate="label"` is projected. */
  readonly label = input('');
  /** Static helper text below the trigger; ignored when a `uiTemplate="caption"` is projected. */
  readonly caption = input('');
  /** Property key read off each option object for its display text. */
  readonly optionLabel = input('label');
  /** Property key read off each option object for its underlying value (used for `multi` selection and equality checks). */
  readonly optionValue = input('value');
  /** Property key read off each option object to determine whether that option is disabled. */
  readonly optionDisabledKey = input('disabled');
  /** Disables the trigger and prevents opening the listbox. */
  readonly disabled = input(false);
  /** In `multi` mode, caps how many options can be selected at once; further selections are ignored once the limit is reached. */
  readonly maxSelectableLimit = input<number | null>(null);
  /** Opens the listbox above the trigger instead of below. */
  readonly showOnTop = input(false);
  /** Native `id` for the trigger; auto-generated when omitted. */
  readonly id = input<string | undefined>(undefined);

  /**
   * For `multi`, the value is an array of extracted `optionValue`s. For single-select, it's the
   * whole selected option.
   */
  readonly value = model<unknown>(undefined);
  /** Emits the newly selected option (single-select) or the updated value array (multi-select) on every selection change. */
  readonly selected = output<unknown>();

  protected readonly chevronIcon = LucideChevronDown;
  protected readonly closeIcon = LucideX;

  protected readonly isOpen = signal(false);
  protected readonly activeIndex = signal(-1);
  protected mouseOver = false;
  protected tabFocusing = false;

  protected readonly generatedId = `ui-select-${nextId++}`;
  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);
  protected readonly listboxId = computed(() => `${this.resolvedId()}-listbox`);

  protected readonly selectedValues = computed<unknown[]>(() =>
    this.multi() && Array.isArray(this.value()) ? (this.value() as unknown[]) : [],
  );
  protected readonly selectedCount = computed(() => this.selectedValues().length);

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly labelTemplate = computed(() => this.templates().find((t) => t.name() === 'label')?.template);
  protected readonly captionTemplate = computed(() => this.templates().find((t) => t.name() === 'caption')?.template);

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  protected optionLabelOf(option: unknown): string {
    if (option === null || typeof option !== 'object') return `${option}`;
    return `${(option as Record<string, unknown>)[this.optionLabel()]}`;
  }

  protected optionValueOf(option: unknown): unknown {
    if (option === null || typeof option !== 'object') return option;
    return (option as Record<string, unknown>)[this.optionValue()];
  }

  protected isOptionDisabled(option: unknown): boolean {
    if (option === null || typeof option !== 'object') return false;
    return !!(option as Record<string, unknown>)[this.optionDisabledKey()];
  }

  protected isOptionSelected(option: unknown): boolean {
    return this.multi()
      ? this.selectedValues().includes(this.optionValueOf(option))
      : this.value() === option;
  }

  protected optionDomId(index: number): string {
    return `${this.resolvedId()}-option-${index}`;
  }

  @HostListener('document:click', ['$event.target'])
  protected onClickOutside(target: EventTarget | null): void {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside && !this.tabFocusing) {
      this.isOpen.set(false);
    }
  }

  protected toggleOpen(): void {
    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) {
      this.activeIndex.set(this.options().findIndex((o) => this.isOptionSelected(o)));
    }
  }

  protected onBlur(): void {
    this.onTouched();
    if (this.mouseOver || this.tabFocusing) return;
    setTimeout(() => this.isOpen.set(false), 110);
  }

  protected selectSingleOption(option: unknown): void {
    if (this.isOptionDisabled(option)) return;
    this.value.set(option);
    this.onChange(option);
    this.selected.emit(option);
    this.isOpen.set(false);
    this.mouseOver = false;
    this.tabFocusing = false;
  }

  protected toggleMultiOption(option: unknown): void {
    if (!this.multi() || this.isOptionDisabled(option)) return;
    const val = this.optionValueOf(option);
    const current = this.selectedValues();
    const alreadySelected = current.includes(val);
    const limit = this.maxSelectableLimit();
    if (!alreadySelected && limit !== null && current.length >= limit) return;

    const next = alreadySelected ? current.filter((v) => v !== val) : [...current, val];
    this.value.set(next);
    this.onChange(next);
    this.selected.emit(next);
  }

  protected removeValue(val: unknown): void {
    this.value.set(this.selectedValues().filter((v) => v !== val));
    this.onChange(this.value());
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    const options = this.options();
    if (!options.length) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.isOpen.set(true);
        this.activeIndex.set(Math.min(this.activeIndex() + 1, options.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.isOpen.set(true);
        this.activeIndex.set(Math.max(this.activeIndex() - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        this.activeIndex.set(0);
        break;
      case 'End':
        event.preventDefault();
        this.activeIndex.set(options.length - 1);
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (!this.isOpen()) {
          this.toggleOpen();
          break;
        }
        const active = options[this.activeIndex()];
        if (active === undefined) break;
        this.multi() ? this.toggleMultiOption(active) : this.selectSingleOption(active);
        break;
      }
      case 'Escape':
        this.isOpen.set(false);
        break;
    }
  }

  writeValue(value: unknown): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
