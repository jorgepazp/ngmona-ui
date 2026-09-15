import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  forwardRef,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideCheckCircle2, LucideDynamicIcon } from '@lucide/angular';
import { Paginator } from '../paginator/paginator';
import { UiTemplateDirective } from '../shared/ui-template.directive';

/**
 * List or chip picker over an array of options, rendered as its own buttons rather than
 * individual `ui-radio` elements. Single-select by default; set `multiple` for a
 * checkbox-group-style multi-select.
 *
 * Follows the WAI-ARIA pattern for the mode in use: `role="radiogroup"` for single-select,
 * `role="group"` with checkboxes for `multiple`, with roving `tabindex` and arrow-key navigation
 * between options. Use `compareWith` to control how options are matched against the bound value,
 * for example when option objects are reloaded from an API and aren't reference-equal. Set
 * `paginator` to page the rendered options through a built-in paginator instead of rendering them
 * all at once.
 */
@Component({
  selector: 'ui-radio-group',
  imports: [NgTemplateOutlet, LucideDynamicIcon, Paginator],
  templateUrl: './radio-group.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroup),
      multi: true,
    },
  ],
})
export class RadioGroup<T = unknown> implements ControlValueAccessor {
  /** Options rendered as radios/chips, in the given order. */
  readonly options = input<readonly T[]>([]);
  /** Visual layout — a vertical list of rows, or a wrapping row of pill-shaped chips. */
  readonly type = input<'list' | 'chips'>('list');
  /** Accessible name for the `radiogroup` element. */
  readonly ariaLabel = input<string | undefined>(undefined);
  /** Overrides the default classes applied to an unselected option. */
  readonly optionClassNames = input('');
  /** Overrides the default classes applied to the selected option. */
  readonly selectedClassNames = input('');
  /** Overrides the default layout classes on the options container. */
  readonly containerClassNames = input('');
  /** Called with each option to decide whether it's disabled; return `true` to disable it. Defaults to enabling every option. */
  readonly disabledPredicate = input<(option: T) => boolean>(() => false);
  /** Called with `(optionA, optionB)` to decide whether two options are the same selection — override for option objects that aren't reference-equal to the bound value (e.g. reloaded from an API). Defaults to `===`. */
  readonly compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);
  /** Allows selecting more than one option at once, rendered as a checkbox group instead of a radio group. */
  readonly multiple = input(false);
  /** Pages the rendered options through a `ui-paginator` instead of rendering them all at once. */
  readonly paginator = input(false);
  /** Number of options shown per page when `paginator` is enabled. */
  readonly pageSize = input(5);

  /** Emits the chosen option when the user selects it, via click or arrow-key navigation. */
  readonly selectedItem = output<T>();

  protected readonly checkIcon = LucideCheckCircle2;

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly optionTemplate = computed(() => this.findTemplate('option'));
  protected readonly headerTemplate = computed(() => this.findTemplate('header'));
  protected readonly footerTemplate = computed(() => this.findTemplate('footer'));

  private readonly optionRefs = viewChildren<ElementRef<HTMLButtonElement>>('optionRef');

  protected readonly value = signal<T | undefined>(undefined);
  protected readonly values = signal<readonly T[]>([]);

  protected readonly containerClass = computed(
    () => this.containerClassNames() || (this.type() === 'list' ? 'flex flex-col gap-1' : 'flex flex-wrap gap-1'),
  );

  protected readonly page = signal(0);
  protected readonly pageCount = computed(() => Math.max(Math.ceil(this.options().length / this.pageSize()), 1));
  protected readonly pagedOptions = computed(() => {
    if (!this.paginator()) return this.options();
    const start = this.page() * this.pageSize();
    return this.options().slice(start, start + this.pageSize());
  });

  private onChange: (value: T | readonly T[] | undefined) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      this.options();
      this.page.set(0);
    });
  }

  protected isSelected(option: T): boolean {
    if (this.multiple()) {
      return this.values().some((selected) => this.compareWith()(option, selected));
    }
    const current = this.value();
    return current !== undefined && this.compareWith()(option, current);
  }

  protected optionClass(option: T): string {
    const base = this.type() === 'list' ? 'p-2 rounded-xl bg-surface border-2 border-border-neutral text-text-primary' : 'px-2 whitespace-nowrap py-1 rounded-full text-text-primary border-2 border-border-neutral text-sm flex items-center justify-center';
    const selected = this.optionClassNames() || base;
    const active = this.selectedClassNames() || (this.type() === 'list' ? `${base} !border-border-active bg-surface-active/10` : `${base} bg-surface-enabled text-surface border-transparent font-medium`);
    const state = this.isSelected(option) ? active : selected;
    const disabled = this.disabledPredicate()(option) ? 'opacity-50 pointer-events-none' : '';
    return `cursor-pointer transition-all select-none ${state} ${disabled}`;
  }

  protected display(option: T): string {
    return typeof option === 'string' || typeof option === 'number' ? `${option}` : JSON.stringify(option);
  }

  protected selectItem(option: T): void {
    if (this.disabledPredicate()(option)) {
      return;
    }
    if (this.multiple()) {
      const current = this.values();
      const index = current.findIndex((selected) => this.compareWith()(option, selected));
      const next = index > -1 ? current.filter((_, i) => i !== index) : [...current, option];
      this.values.set(next);
      this.onChange(next);
    } else {
      this.value.set(option);
      this.onChange(option);
    }
    this.selectedItem.emit(option);
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const refs = this.optionRefs();
    if (!refs.length) return;

    let nextIndex: number | null = null;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        nextIndex = (index + 1) % refs.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        nextIndex = (index - 1 + refs.length) % refs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = refs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    refs[nextIndex]?.nativeElement.focus();
    if (this.multiple()) {
      // Checkbox-group convention: arrow keys move focus only, Space/Enter toggles.
      return;
    }
    const nextOption = this.pagedOptions()[nextIndex];
    if (nextOption !== undefined && !this.disabledPredicate()(nextOption)) {
      this.selectItem(nextOption);
    }
  }

  protected tabIndexFor(option: T, index: number): number {
    if (this.isSelected(option)) return 0;
    const hasSelection = this.multiple() ? this.values().length > 0 : this.value() !== undefined;
    return !hasSelection && index === 0 ? 0 : -1;
  }

  private findTemplate(name: string) {
    return this.templates().find((t) => t.name() === name)?.template;
  }

  writeValue(value: T | readonly T[] | undefined): void {
    if (this.multiple()) {
      this.values.set(Array.isArray(value) ? value : []);
    } else {
      this.value.set(value as T | undefined);
    }
  }

  registerOnChange(fn: (value: T | readonly T[] | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
