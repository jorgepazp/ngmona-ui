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
import { LucideChevronsUpDown, LucideCheck, LucideDynamicIcon } from '@lucide/angular';
import { FloatingPanel } from '../shared/floating-panel';

let nextId = 0;

/**
 * Single-select combobox: a text-input trigger (instead of `Select`'s button trigger) that
 * filters its option list as you type, but still only lets you land on one of the supplied
 * options — free text you don't select from the list is never committed as `value`. For
 * unconstrained free text with suggestions, use `Autocomplete` instead.
 *
 * Positioned with `FloatingPanel` (CDK Overlay) rather than `Select`'s manual absolute
 * positioning. Follows the same `optionLabel`/`optionValue` accessor-function shape as `Select`
 * so option data (plain objects, or primitives) works identically between the two.
 *
 * The displayed input text ("query") is a separate signal from the committed `value`: while the
 * panel is open it reflects whatever the user is typing/filtering with; once the panel closes it
 * resyncs to the label of the committed value (or empties out if nothing is selected).
 */
@Component({
  selector: 'ui-combobox',
  imports: [LucideDynamicIcon],
  templateUrl: './combobox.html',
  providers: [
    FloatingPanel,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Combobox),
      multi: true,
    },
  ],
})
export class Combobox implements ControlValueAccessor {
  private readonly floatingPanel = inject(FloatingPanel);
  private readonly viewContainerRef = inject(ViewContainerRef);

  /** The full list of selectable options, filtered client-side against the typed query while the panel is open. */
  readonly options = input<readonly unknown[]>([]);
  /** Placeholder text shown in the trigger input when nothing has been typed or selected. */
  readonly placeholder = input('');
  /** Label rendered above the trigger input. */
  readonly label = input('');
  /** Helper text rendered below the trigger input. */
  readonly caption = input('');
  /** Property name read off each option object for its display label, when options are objects rather than primitives. */
  readonly optionLabel = input('label');
  /** Property name read off each option object for its committed value, when options are objects rather than primitives. */
  readonly optionValue = input('value');
  /** Property name read off each option object to determine whether that option is disabled. */
  readonly optionDisabledKey = input('disabled');
  /** Disables the trigger input entirely — it can't be focused or opened. */
  readonly disabled = input(false);
  /** DOM id for the trigger input; auto-generated when omitted. */
  readonly id = input<string | undefined>(undefined);

  /** The committed selection — one entry from `options()`, or `undefined`/`null` when empty. */
  readonly value = model<unknown>(undefined);
  /** Fires with the selected option whenever a user picks one from the list. */
  readonly selected = output<unknown>();

  protected readonly chevronIcon = LucideChevronsUpDown;
  protected readonly checkIcon = LucideCheck;

  protected readonly isOpen = signal(false);
  protected readonly query = signal('');
  private readonly isFiltering = signal(false);
  protected readonly activeIndex = signal(-1);
  protected hoveringPanel = false;

  protected readonly triggerEl = viewChild<ElementRef<HTMLInputElement>>('trigger');
  protected readonly panelTemplate = viewChild<TemplateRef<unknown>>('panel');

  protected readonly generatedId = `ui-combobox-${nextId++}`;
  protected readonly resolvedId = computed(() => this.id() ?? this.generatedId);
  protected readonly listboxId = computed(() => `${this.resolvedId()}-listbox`);

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  protected readonly filteredOptions = computed(() => {
    const opts = this.options();
    if (!this.isFiltering()) return opts;
    const q = this.query().trim().toLowerCase();
    if (!q) return opts;
    return opts.filter((o) => this.optionLabelOf(o).toLowerCase().includes(q));
  });

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Bridge our own `isOpen` state to FloatingPanel — same pattern as Popover.
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

    // Reflect FloatingPanel closing itself (outside click / Escape) back into our own state.
    effect(() => {
      if (!this.floatingPanel.isOpen() && this.isOpen()) {
        this.isOpen.set(false);
      }
    });

    // Whenever the panel is closed, the input text should mirror the committed value.
    effect(() => {
      if (this.isOpen()) return;
      const val = this.value();
      this.query.set(val === undefined || val === null ? '' : this.optionLabelOf(val));
      this.isFiltering.set(false);
    });
  }

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
    const val = this.value();
    if (val === undefined || val === null) return false;
    return this.optionValueOf(val) === this.optionValueOf(option);
  }

  protected optionDomId(index: number): string {
    return `${this.resolvedId()}-option-${index}`;
  }

  protected openPanel(): void {
    if (this.isOpen() || this.isDisabled()) return;
    this.isFiltering.set(false);
    this.isOpen.set(true);
    this.activeIndex.set(this.filteredOptions().findIndex((o) => this.isOptionSelected(o)));
  }

  protected onChevronClick(): void {
    if (this.isDisabled()) return;
    this.isOpen() ? this.isOpen.set(false) : this.openPanel();
    this.triggerEl()?.nativeElement.focus();
  }

  protected onFocus(): void {
    this.openPanel();
  }

  protected onBlur(): void {
    this.onTouched();
    if (this.hoveringPanel) return;
    setTimeout(() => this.isOpen.set(false), 120);
  }

  protected onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.query.set(text);
    this.isFiltering.set(true);
    if (!this.isOpen()) this.isOpen.set(true);
    this.activeIndex.set(0);
  }

  protected selectOption(option: unknown): void {
    if (this.isOptionDisabled(option)) return;
    this.value.set(option);
    this.onChange(option);
    this.selected.emit(option);
    this.query.set(this.optionLabelOf(option));
    this.isFiltering.set(false);
    this.isOpen.set(false);
    this.triggerEl()?.nativeElement.focus();
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    const opts = this.filteredOptions();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.openPanel();
          break;
        }
        if (!opts.length) break;
        this.activeIndex.set(Math.min(this.activeIndex() + 1, opts.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.openPanel();
          break;
        }
        if (!opts.length) break;
        this.activeIndex.set(Math.max(this.activeIndex() - 1, 0));
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
        event.preventDefault();
        const active = opts[this.activeIndex()];
        if (active !== undefined) this.selectOption(active);
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
