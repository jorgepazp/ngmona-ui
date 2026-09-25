import { Component, computed, input, output, viewChild, ElementRef } from '@angular/core';
import { LucideDynamicIcon, LucideLoaderCircle, type LucideIconInput } from '@lucide/angular';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'icon';
type ButtonSize = 'default' | 'xl' | 'md' | 'sm';

/**
 * Button with `primary`, `secondary`, `tertiary` and `icon`-only variants, plus loading and
 * inverse states.
 *
 * Colors are driven by the `--color-primary-*` theme tokens; override those CSS variables to
 * restyle every button at once.
 */
@Component({
  selector: 'ui-button',
  imports: [LucideDynamicIcon],
  templateUrl: './button.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class Button {
  /** Visual style. `'icon'` renders a round icon-only button — pair it with `icon` and `ariaLabel`. */
  readonly variant = input<ButtonVariant>('primary');
  /** Native `type` attribute of the underlying `<button>`. */
  readonly attrType = input<'button' | 'submit' | 'reset'>('button');
  /** Icon shown next to the label (or alone, for `variant="icon"`). Accepts a Lucide icon component or icon data. */
  readonly icon = input<LucideIconInput | undefined>(undefined);
  /** Side the `icon` renders on, relative to the projected label content. Ignored for `variant="icon"`. */
  readonly iconPos = input<'left' | 'right'>('right');
  /** Disables the button and applies the disabled visual style. */
  readonly disabled = input(false);
  /** Shows a spinning loader in place of `icon` and disables the button while `true`. */
  readonly loading = input(false);
  /** Extra utility classes appended after the computed variant/size classes, for one-off overrides. */
  readonly classNames = input('');
  /** Required for `variant="icon"` buttons, since they have no visible text label. */
  readonly ariaLabel = input<string | undefined>(undefined);
  /** Controls height/padding/text size; `'icon'`-variant buttons ignore this and stay a fixed round size. */
  readonly size = input<ButtonSize>('default');
  /** Renders the button for use on a dark/colored background (white text/border instead of the tinted default). */
  readonly inverse = input(false);

  /** Reference to the native `<button>` element, e.g. for imperative `.focus()`. */
  readonly buttonRef = viewChild<ElementRef<HTMLButtonElement>>('buttonEl');

  /** Fires on a native click (not emitted while `disabled` or `loading`, since the `<button>` itself is disabled then). */
  readonly clicked = output<MouseEvent>();
  /** Fires when the button gains focus. */
  readonly focused = output<FocusEvent>();
  /** Fires when the button loses focus. */
  readonly blurred = output<FocusEvent>();

  protected readonly loaderIcon = LucideLoaderCircle;

  protected readonly buttonClass = computed(() => {
    const variant = this.variant();
    const base = `select-none flex font-semibold justify-center relative items-center transition-colors cursor-pointer disabled:cursor-not-allowed rounded h-min whitespace-nowrap ${this.sizeClass()} !outline outline-transparent !outline-2 outline-offset-2  `;

    switch (variant) {
      case 'secondary':
        return `${base} ${this.secondaryClass()}`;
      case 'tertiary':
        return `${base} !border-none ${this.tertiaryClass()}`;
      case 'icon':
        return `${base} bg-neutral-100 !border-none !rounded-full min-w-fit !w-[32px] !h-[32px] active:!outline-transparent [&:not(:active)]:focus:!outline-accent-500  ${
          this.disabled() ? 'text-neutral-200' : 'text-neutral-500 hover:bg-accent-100 hover:text-accent-500'
        }`;
      case 'primary':
      default:
        return `${base} !border-none ${this.primaryClass()}`;
    }
  });

  private sizeClass(): string {
    if (this.variant() === 'icon') {
      return 'text-label-xl';
    }
    switch (this.size()) {
      case 'xl':
        return 'text-label-xl !py-4 !px-8';
      case 'md':
        return 'text-label-md !py-2 !px-6';
      case 'sm':
        return 'text-label-xs !py-2 !px-4';
      case 'default':
      default:
        return 'text-label-lg py-3 !px-6';
    }
  }

  private primaryClass(): string {
    if (this.disabled()) {
      return this.inverse()
        ? 'bg-surface-white/25 text-white/60'
        : 'bg-neutral-100 text-neutral-300 border-none';
    }
    return this.inverse()
      ? 'bg-white text-primary-500 hover:bg-white/85 active:bg-white active:!outline-transparent [&:not(:active)]:focus:!outline-white'
      : 'bg-primary-500 text-white hover:bg-primary-300 active:bg-primary-600 [&:not(:active)]:focus:!outline-primary-500';
  }

  private secondaryClass(): string {
    if (this.disabled()) {
      return this.inverse()
        ? '!border-white !border-solid border text-white opacity-60 bg-transparent'
        : '!border !border-neutral-800 !text-neutral-800 bg-transparent';
    }
    if (this.inverse()) {
      return '!border-solid !border border-white bg-surface-white/0 text-white hover:bg-surface-white/15 active:bg-surface-white/10 active:!outline-transparent [&:not(:active)]:focus:outline-white';
    }
    return '!border border-solid !border-primary-500 text-primary-500 bg-primary-300/0 hover:bg-primary-300/5 active:bg-primary-300/10 active:!outline-transparent [&:not(:active)]:focus:!outline-primary-500';
  }

  private tertiaryClass(): string {
    if (this.disabled()) {
      return this.inverse()
        ? '!text-surface-white/60 bg-transparent'
        : '!text-neutral-800 border-none bg-transparent';
    }
    if (this.inverse()) {
      return 'text-white bg-surface-white/0 hover:bg-surface-white/15 active:bg-surface-white/10 active:!outline-transparent [&:not(:active)]:focus:outline-white';
    }
    return 'text-primary-500 bg-primary-500/0 hover:bg-primary-500/5 active:bg-primary-500/10 active:!outline-transparent [&:not(:active)]:focus:!outline-primary-500 [&:not(:active)]:focus:!outline';
  }
}
