import { Component, ElementRef, booleanAttribute, input, output, viewChild } from '@angular/core';
import { type LucideIconInput } from '@lucide/angular';
import { Button, type ButtonColor, type ButtonShape, type ButtonSize, type ButtonVariant } from './button';

/**
 * @deprecated Use `<button uiButton>` / `<a uiButton>` (the `Button` component) instead: it styles
 * the native element directly, so `routerLink`, `[style]`, `type`, `aria-*` and projected icons
 * all work. Kept so existing `<ui-button>` templates keep working — import `LegacyButton` in
 * place of `Button` wherever a template still uses `<ui-button>`.
 *
 * Migration: `(clicked)` → `(click)`, `attrType` → `type`, `classNames` → `class`,
 * `ariaLabel` → `aria-label`, `(focused)`/`(blurred)` → `(focus)`/`(blur)`.
 */
@Component({
  selector: 'ui-button',
  imports: [Button],
  template: `<button
    uiButton
    #buttonEl
    [variant]="variant()"
    [color]="color()"
    [shape]="shape()"
    [size]="size()"
    [icon]="icon()"
    [iconPos]="iconPos()"
    [disabled]="disabled()"
    [loading]="loading()"
    [inverse]="inverse()"
    [type]="attrType()"
    [aria-label]="ariaLabel()"
    [class]="classNames()"
    (click)="clicked.emit($event)"
    (focus)="focused.emit($event)"
    (blur)="blurred.emit($event)"
  ><ng-content></ng-content></button>`,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class LegacyButton {
  /** Visual style. `'icon'` renders a round icon-only button — pair it with `icon` and `ariaLabel`. */
  readonly variant = input<ButtonVariant>('primary');
  /** Color role: `primary`, or a severity (`danger`, `success`, `warning`, `info`). */
  readonly color = input<ButtonColor>('primary');
  /** `'pill'` fully rounds a text button. */
  readonly shape = input<ButtonShape>('default');
  /** Native `type` attribute of the underlying `<button>`. */
  readonly attrType = input<'button' | 'submit' | 'reset'>('button');
  /** Icon shown next to the label (or alone, for `variant="icon"`). */
  readonly icon = input<LucideIconInput | undefined>(undefined);
  /** Side of the label the `icon` renders on. Ignored for `variant="icon"`. */
  readonly iconPos = input<'left' | 'right'>('right');
  /** Disables the button and applies the disabled visual style. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Shows a spinning loader in place of `icon` and disables the button while `true`. */
  readonly loading = input(false, { transform: booleanAttribute });
  /** Extra utility classes appended after the computed variant/size classes. */
  readonly classNames = input('');
  /** Required for `variant="icon"` buttons, since they have no visible text label. */
  readonly ariaLabel = input<string | undefined>(undefined);
  /** Controls height/padding/text size. */
  readonly size = input<ButtonSize>('default');
  /** Renders the button for use on a dark/colored background. */
  readonly inverse = input(false, { transform: booleanAttribute });

  /** Reference to the native `<button>` element, e.g. for imperative `.focus()`. */
  readonly buttonRef = viewChild('buttonEl', { read: ElementRef<HTMLButtonElement> });

  /** Fires on a native click (not while `disabled` or `loading`). */
  readonly clicked = output<MouseEvent>();
  /** Fires when the button gains focus. */
  readonly focused = output<FocusEvent>();
  /** Fires when the button loses focus. */
  readonly blurred = output<FocusEvent>();
}
