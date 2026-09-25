import { Component, computed, effect, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type ToggleColor = 'default' | 'info' | 'success' | 'warning' | 'danger';

/**
 * Boolean on/off switch with native forms interop (`ControlValueAccessor`, works with
 * `formControlName`/`ngModel`) and a signal-based `[(checked)]` two-way binding for standalone
 * usage.
 */
@Component({
  selector: 'ui-toggle',
  templateUrl: './toggle.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Toggle),
      multi: true,
    },
  ],
})
export class Toggle implements ControlValueAccessor {
  /** On/off state. Two-way bindable via `[(checked)]`. */
  readonly checked = model(false);
  /** Track color shown while checked. */
  readonly color = input<ToggleColor>('default');
  /** Size of the track/thumb. */
  readonly size = input<'default' | 'lg'>('default');
  /** Disables interaction and marks the control as disabled for `ControlValueAccessor` consumers. */
  readonly disabled = input(false);
  /** Accessible label for screen readers, since the control has no visible text. */
  readonly ariaLabel = input<string | undefined>(undefined);

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  protected readonly trackClass = computed(() => {
    const size = this.size() === 'lg' ? 'w-14 h-8 after:top-1 after:left-1 after:h-6 after:w-6' : 'w-[44px] h-6 after:top-[2px] after:left-[2px] after:h-[20px] after:w-[20px]';
    const colorMap: Record<ToggleColor, string> = {
      default: 'peer-checked:bg-primary-500',
      info: 'peer-checked:bg-info',
      success: 'peer-checked:bg-success',
      warning: 'peer-checked:bg-warning',
      danger: 'peer-checked:bg-danger',
    };
    return `${size} ${colorMap[this.color()]}`;
  });

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => this.onChange(this.checked()));
  }

  protected onInput(event: Event): void {
    this.checked.set((event.target as HTMLInputElement).checked);
  }

  protected markTouched(): void {
    this.onTouched();
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
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
