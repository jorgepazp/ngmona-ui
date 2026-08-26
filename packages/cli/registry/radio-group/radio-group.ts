import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChildren,
  ElementRef,
  forwardRef,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideCheckCircle2, LucideDynamicIcon } from '@lucide/angular';
import { UiTemplateDirective } from '../shared/ui-template.directive';

/**
 * Single-select list/chip picker over an arbitrary array of options (not a wrapper around
 * individual `<ui-radio>` elements — this renders its own buttons).
 *
 * The original was a stack of `<div (click)="...">`s with no radio semantics at all — not
 * reachable or operable via keyboard, nothing announced to screen readers. Rebuilt here on the
 * WAI-ARIA "radio group" pattern: `role="radiogroup"` + `role="radio"` buttons, roving
 * `tabindex`, and Up/Down/Left/Right arrow-key navigation. The `compareWith` input existed in
 * the original but was declared and never actually used (selection always fell back to `==`) —
 * wired up for real here.
 */
@Component({
  selector: 'ui-radio-group',
  imports: [NgTemplateOutlet, LucideDynamicIcon],
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

  /** Emits the chosen option when the user selects it, via click or arrow-key navigation. */
  readonly selectedItem = output<T>();

  protected readonly checkIcon = LucideCheckCircle2;

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly optionTemplate = computed(() => this.findTemplate('option'));
  protected readonly headerTemplate = computed(() => this.findTemplate('header'));
  protected readonly footerTemplate = computed(() => this.findTemplate('footer'));

  private readonly optionRefs = viewChildren<ElementRef<HTMLButtonElement>>('optionRef');

  protected readonly value = signal<T | undefined>(undefined);

  protected readonly containerClass = computed(
    () => this.containerClassNames() || (this.type() === 'list' ? 'flex flex-col gap-1' : 'flex flex-wrap gap-1'),
  );

  private onChange: (value: T | undefined) => void = () => {};
  private onTouched: () => void = () => {};

  protected isSelected(option: T): boolean {
    const current = this.value();
    return current !== undefined && this.compareWith()(option, current);
  }

  protected optionClass(option: T): string {
    const base = this.type() === 'list' ? 'p-2 rounded-xl bg-white border-2 border-neutral-500' : 'px-[14px] whitespace-nowrap py-[6px] rounded-full border-2 text-paragraph-sm flex items-center justify-center';
    const selected = this.optionClassNames() || base;
    const active = this.selectedClassNames() || (this.type() === 'list' ? `${base} border-primary-500` : `${base} bg-neutral-500 border-transparent font-medium`);
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
    this.value.set(option);
    this.onChange(option);
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
    const nextOption = this.options()[nextIndex];
    refs[nextIndex]?.nativeElement.focus();
    if (nextOption !== undefined && !this.disabledPredicate()(nextOption)) {
      this.selectItem(nextOption);
    }
  }

  protected tabIndexFor(option: T, index: number): number {
    if (this.isSelected(option)) return 0;
    const hasSelection = this.value() !== undefined;
    return !hasSelection && index === 0 ? 0 : -1;
  }

  private findTemplate(name: string) {
    return this.templates().find((t) => t.name() === name)?.template;
  }

  writeValue(value: T | undefined): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: T | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
