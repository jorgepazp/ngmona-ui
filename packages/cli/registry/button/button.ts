import {
  Component,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  isDevMode,
} from '@angular/core';
import { LucideDynamicIcon, LucideLoaderCircle, type LucideIconInput } from '@lucide/angular';
import { UI_LABEL_SOURCE } from '../shared/label-source';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'icon';
export type ButtonColor = 'primary' | 'danger' | 'success' | 'warning' | 'info';
export type ButtonShape = 'default' | 'pill';
export type ButtonSize = 'default' | 'xl' | 'md' | 'sm';

/**
 * Button styling and behavior applied directly to a native `<button>` or `<a>`:
 * `<button uiButton>Save</button>`, `<a uiButton routerLink="/settings">Settings</a>`.
 *
 * Because the host is the real element, everything native works as usual: `type`, `[style]`,
 * `class`, `routerLink`, `(click)`, `aria-*`, forms. Put any content inside, including your own
 * icons; `icon` is a shortcut for a Lucide icon next to the label.
 *
 * `variant` sets the style (`primary`, `secondary` outline, `tertiary` text-only, `icon` round
 * icon-only), `color` the severity (`danger`, `success`, `warning`, `info`), and `shape="pill"`
 * fully rounds a text button.
 *
 * Icon-only buttons need an accessible name: set `aria-label`, or add `uiTooltip` to the same
 * element and its text is used. In development, an icon-only button with neither logs a warning.
 */
@Component({
  selector: 'button[uiButton], a[uiButton]',
  exportAs: 'uiButton',
  imports: [LucideDynamicIcon],
  templateUrl: './button.html',
  host: {
    '[class]': 'buttonClass()',
    '[attr.type]': 'isAnchor ? null : type()',
    '[attr.disabled]': '!isAnchor && isInactive() ? "" : null',
    '[attr.aria-disabled]': 'isAnchor && isInactive() ? "true" : null',
    '[attr.aria-busy]': 'loading() || null',
    '[attr.aria-label]': 'accessibleLabel()',
  },
})
export class Button {
  /** Visual style. `'icon'` renders a round icon-only button — give it an `aria-label` or a `uiTooltip`. */
  readonly variant = input<ButtonVariant>('primary');
  /** Color role: the brand `primary`, or a severity for destructive, confirming, cautionary or informational actions. */
  readonly color = input<ButtonColor>('primary');
  /** `'pill'` fully rounds a text button. Icon-only buttons are always round. */
  readonly shape = input<ButtonShape>('default');
  /** Controls height/padding/text size; `'icon'`-variant buttons ignore this and stay a fixed round size. */
  readonly size = input<ButtonSize>('default');
  /** Lucide icon shown next to the label (or alone, for `variant="icon"`). You can also project your own icon markup. */
  readonly icon = input<LucideIconInput | undefined>(undefined);
  /** Side `icon` renders on, relative to the projected content. Ignored for `variant="icon"`. */
  readonly iconPos = input<'left' | 'right'>('right');
  /** Disables the button (on `<a>`: `aria-disabled`, not focusable, not clickable). */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Shows a spinning loader in place of the content and disables the button while `true`. */
  readonly loading = input(false, { transform: booleanAttribute });
  /** Renders the button for use on a dark/colored background (white text/border instead of the tinted default). */
  readonly inverse = input(false, { transform: booleanAttribute });
  /** Native `type` of a `<button>`. Defaults to `'button'` (not the browser's `'submit'`); ignored on `<a>`. */
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  /** Accessible name. For icon-only buttons without it, the text of a `uiTooltip` on the same element is used. */
  readonly ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });

  private readonly host = inject<ElementRef<HTMLButtonElement | HTMLAnchorElement>>(ElementRef).nativeElement;
  private readonly labelSource = inject(UI_LABEL_SOURCE, { self: true, optional: true });

  protected readonly isAnchor = this.host.tagName === 'A';
  protected readonly loaderIcon = LucideLoaderCircle;

  protected readonly isInactive = computed(() => this.disabled() || this.loading());

  private readonly labelFromSource = computed(() =>
    this.variant() === 'icon' && !this.ariaLabel() ? this.labelSource?.label() || null : null,
  );

  protected readonly accessibleLabel = computed(() => this.ariaLabel() || this.labelFromSource());

  constructor() {
    // The tooltip names the button, so it shouldn't also describe it with the same text.
    effect(() => this.labelSource?.usedAsLabel.set(this.labelFromSource() !== null));

    // Anchors have no `disabled`: take them out of the tab order and ignore pointer input instead.
    effect(() => {
      if (!this.isAnchor) return;
      if (this.isInactive()) this.host.setAttribute('tabindex', '-1');
      else if (this.host.getAttribute('tabindex') === '-1') this.host.removeAttribute('tabindex');
    });

    if (isDevMode()) {
      afterNextRender(() => {
        if (this.variant() !== 'icon') return;
        const named =
          this.host.getAttribute('aria-label') ||
          this.host.getAttribute('aria-labelledby') ||
          this.host.getAttribute('title') ||
          this.host.textContent?.trim();
        if (!named) {
          console.warn(
            '[ngmona] Icon-only uiButton has no accessible name — screen readers will announce it as just "button". ' +
              'Add aria-label="…" or a uiTooltip on the same element.',
            this.host,
          );
        }
      });
    }
  }

  protected readonly buttonClass = computed(() => {
    const variant = this.variant();
    const rounded = variant === 'icon' || this.shape() === 'pill' ? '!rounded-full' : 'rounded';
    // An <a> sits in text flow and has no :disabled state, so it gets inline layout and no pointer input when inactive.
    const element = this.isAnchor
      ? `inline-flex no-underline ${this.isInactive() ? 'pointer-events-none' : ''}`
      : 'flex disabled:cursor-not-allowed';
    const base = `select-none ${element} font-semibold justify-center relative items-center transition-colors cursor-pointer h-min whitespace-nowrap ${rounded} ${this.sizeClass()} !outline outline-transparent !outline-2 outline-offset-2`;

    switch (variant) {
      case 'secondary':
        return `${base} ${this.secondaryClass()}`;
      case 'tertiary':
        return `${base} !border-none ${this.tertiaryClass()}`;
      case 'icon':
        return `${base} !border-none min-w-fit !w-[32px] !h-[32px] active:!outline-transparent ${this.iconClass()}`;
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
    if (this.isInactive()) {
      return this.inverse() ? 'bg-surface-white/25 text-white/60' : 'bg-neutral-100 text-neutral-300 border-none';
    }
    if (this.inverse()) {
      return 'bg-white text-primary-500 hover:bg-white/85 active:bg-white active:!outline-transparent [&:not(:active)]:focus:!outline-white';
    }
    return SOLID_CLASSES[this.color()];
  }

  private secondaryClass(): string {
    if (this.isInactive()) {
      return this.inverse()
        ? '!border-white !border-solid border text-white opacity-60 bg-transparent'
        : '!border !border-neutral-800 !text-neutral-800 bg-transparent';
    }
    if (this.inverse()) {
      return '!border-solid !border border-white bg-surface-white/0 text-white hover:bg-surface-white/15 active:bg-surface-white/10 active:!outline-transparent [&:not(:active)]:focus:outline-white';
    }
    return OUTLINE_CLASSES[this.color()];
  }

  private tertiaryClass(): string {
    if (this.isInactive()) {
      return this.inverse() ? '!text-surface-white/60 bg-transparent' : '!text-neutral-800 border-none bg-transparent';
    }
    if (this.inverse()) {
      return 'text-white bg-surface-white/0 hover:bg-surface-white/15 active:bg-surface-white/10 active:!outline-transparent [&:not(:active)]:focus:outline-white';
    }
    return GHOST_CLASSES[this.color()];
  }

  private iconClass(): string {
    if (this.isInactive()) return 'bg-neutral-100 text-neutral-200';
    return ICON_CLASSES[this.color()];
  }
}

// Class lists are spelled out in full per color (never built from `${color}` fragments) so that
// Tailwind's scanner, and the CLI's prefix rewriter, can see every class.

/** `variant="primary"`: filled. Severities use the semantic surface tokens, which keep contrast in dark mode. */
const SOLID_CLASSES: Record<ButtonColor, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-300 active:bg-primary-600 [&:not(:active)]:focus:!outline-primary-500',
  danger: 'bg-surface-danger text-text-primary-inverse hover:bg-surface-danger/90 active:bg-surface-danger/80 [&:not(:active)]:focus:!outline-surface-danger',
  success: 'bg-surface-success text-text-primary-inverse hover:bg-surface-success/90 active:bg-surface-success/80 [&:not(:active)]:focus:!outline-surface-success',
  warning: 'bg-surface-warning text-text-primary-inverse hover:bg-surface-warning/90 active:bg-surface-warning/80 [&:not(:active)]:focus:!outline-surface-warning',
  info: 'bg-surface-info text-text-primary-inverse hover:bg-surface-info/90 active:bg-surface-info/80 [&:not(:active)]:focus:!outline-surface-info',
};

/** `variant="secondary"`: outlined. */
const OUTLINE_CLASSES: Record<ButtonColor, string> = {
  primary: '!border border-solid !border-primary-500 text-primary-500 bg-primary-300/0 hover:bg-primary-300/5 active:bg-primary-300/10 active:!outline-transparent [&:not(:active)]:focus:!outline-primary-500',
  danger: '!border border-solid !border-text-danger text-text-danger bg-transparent hover:bg-surface-danger-light active:bg-surface-danger-light active:!outline-transparent [&:not(:active)]:focus:!outline-text-danger',
  success: '!border border-solid !border-text-success text-text-success bg-transparent hover:bg-surface-success-light active:bg-surface-success-light active:!outline-transparent [&:not(:active)]:focus:!outline-text-success',
  warning: '!border border-solid !border-text-warning text-text-warning bg-transparent hover:bg-surface-warning-light active:bg-surface-warning-light active:!outline-transparent [&:not(:active)]:focus:!outline-text-warning',
  info: '!border border-solid !border-text-info text-text-info bg-transparent hover:bg-surface-info-light active:bg-surface-info-light active:!outline-transparent [&:not(:active)]:focus:!outline-text-info',
};

/** `variant="tertiary"`: text only. */
const GHOST_CLASSES: Record<ButtonColor, string> = {
  primary: 'text-primary-500 bg-primary-500/0 hover:bg-primary-500/5 active:bg-primary-500/10 active:!outline-transparent [&:not(:active)]:focus:!outline-primary-500 [&:not(:active)]:focus:!outline',
  danger: 'text-text-danger bg-transparent hover:bg-surface-danger-light active:bg-surface-danger-light active:!outline-transparent [&:not(:active)]:focus:!outline-text-danger',
  success: 'text-text-success bg-transparent hover:bg-surface-success-light active:bg-surface-success-light active:!outline-transparent [&:not(:active)]:focus:!outline-text-success',
  warning: 'text-text-warning bg-transparent hover:bg-surface-warning-light active:bg-surface-warning-light active:!outline-transparent [&:not(:active)]:focus:!outline-text-warning',
  info: 'text-text-info bg-transparent hover:bg-surface-info-light active:bg-surface-info-light active:!outline-transparent [&:not(:active)]:focus:!outline-text-info',
};

/** `variant="icon"`: round, icon-only. */
const ICON_CLASSES: Record<ButtonColor, string> = {
  primary: 'bg-neutral-100 text-neutral-500 hover:bg-accent-100 hover:text-accent-500 [&:not(:active)]:focus:!outline-accent-500',
  danger: 'bg-neutral-100 text-text-danger hover:bg-surface-danger-light [&:not(:active)]:focus:!outline-text-danger',
  success: 'bg-neutral-100 text-text-success hover:bg-surface-success-light [&:not(:active)]:focus:!outline-text-success',
  warning: 'bg-neutral-100 text-text-warning hover:bg-surface-warning-light [&:not(:active)]:focus:!outline-text-warning',
  info: 'bg-neutral-100 text-text-info hover:bg-surface-info-light [&:not(:active)]:focus:!outline-text-info',
};
