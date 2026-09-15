import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  ViewContainerRef,
  viewChild,
  effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FloatingPanel } from '../shared/floating-panel';

let nextId = 0;

/**
 * Free-text input with a filterable, keyboard-navigable list of suggestions.
 *
 * Unlike `Combobox`, the typed text is always the committed `value`. Suggestions in `suggestions`
 * are only an assist: submitting text that matches none of them is fully supported. Use Arrow
 * Up/Down to move through the list, Enter to select the highlighted suggestion, and Escape to
 * close it.
 */
@Component({
  selector: 'ui-autocomplete',
  templateUrl: './autocomplete.html',
  providers: [
    FloatingPanel,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Autocomplete),
      multi: true,
    },
  ],
})
export class Autocomplete implements ControlValueAccessor {
  private readonly floatingPanel = inject(FloatingPanel);
  private readonly viewContainerRef = inject(ViewContainerRef);

  /** Full suggestion list; filtered client-side against the current `value` (case-insensitive substring match). */
  readonly suggestions = input<string[]>([]);
  /** Placeholder text shown in the input when empty. */
  readonly placeholder = input('');
  /** Field label rendered above the input. */
  readonly label = input('');
  /** Helper text rendered below the input. */
  readonly caption = input('');
  /** Disables the input and closes the suggestions panel. */
  readonly disabled = input(false);
  /** Native `id` for the input; auto-generated when omitted. */
  readonly id = input<string | undefined>(undefined);

  /** Current text value. Two-way bindable via `[(value)]`; always reflects whatever's typed, whether or not it matches a suggestion. */
  readonly value = model<string>('');
  /** Fires when the user picks a suggestion from the dropdown (not fired when free-typed text is simply committed). */
  readonly selected = output<string>();

  protected readonly isOpen = signal(false);
  /** -1 means "no suggestion highlighted" — Enter just commits the typed text as-is. */
  protected readonly activeIndex = signal(-1);
  protected hoveringPanel = false;

  protected readonly triggerEl = viewChild<ElementRef<HTMLInputElement>>('trigger');
  protected readonly panelTemplate = viewChild<TemplateRef<unknown>>('panel');

  protected readonly generatedId = `ui-autocomplete-${nextId++}`;
  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);
  protected readonly listboxId = computed(() => `${this.resolvedId()}-listbox`);

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  protected readonly filteredSuggestions = computed(() => {
    const list = this.suggestions();
    const val = this.value()?.trim().toLowerCase();
    if (!val) return list;
    return list.filter((s) => s.toLowerCase().includes(val));
  });

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      const open = this.isOpen();
      const trigger = this.triggerEl()?.nativeElement;
      const panel = this.panelTemplate();
      if (!trigger || !panel) return;

      if (open) {
        this.floatingPanel.open(trigger, panel, this.viewContainerRef, { matchOriginWidth: true });
      } else {
        this.floatingPanel.close();
      }
    });

    effect(() => {
      if (!this.floatingPanel.isOpen() && this.isOpen()) {
        this.isOpen.set(false);
      }
    });
  }

  protected optionDomId(index: number): string {
    return `${this.resolvedId()}-option-${index}`;
  }

  protected onFocus(): void {
    if (this.isDisabled()) return;
    this.isOpen.set(true);
  }

  protected onBlur(): void {
    this.onTouched();
    if (this.hoveringPanel) return;
    setTimeout(() => this.isOpen.set(false), 120);
  }

  protected onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.value.set(text);
    this.onChange(text);
    this.isOpen.set(true);
    this.activeIndex.set(-1);
  }

  protected selectSuggestion(item: string): void {
    this.value.set(item);
    this.onChange(item);
    this.selected.emit(item);
    this.isOpen.set(false);
    this.triggerEl()?.nativeElement.focus();
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    const opts = this.filteredSuggestions();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
          break;
        }
        if (!opts.length) break;
        this.activeIndex.set(Math.min(this.activeIndex() + 1, opts.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
          break;
        }
        if (!opts.length) break;
        this.activeIndex.set(Math.max(this.activeIndex() - 1, -1));
        break;
      case 'Home':
        if (this.isOpen() && opts.length) {
          event.preventDefault();
          this.activeIndex.set(0);
        }
        break;
      case 'End':
        if (this.isOpen() && opts.length) {
          event.preventDefault();
          this.activeIndex.set(opts.length - 1);
        }
        break;
      case 'Enter': {
        if (!this.isOpen()) break;
        const active = this.activeIndex() >= 0 ? opts[this.activeIndex()] : undefined;
        if (active === undefined) {
          // No suggestion highlighted — the typed text is already the committed value.
          this.isOpen.set(false);
          break;
        }
        event.preventDefault();
        this.selectSuggestion(active);
        break;
      }
      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.isOpen.set(false);
        }
        break;
    }
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
