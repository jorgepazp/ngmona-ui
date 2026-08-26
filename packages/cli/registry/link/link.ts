import { Component, computed, input, output } from '@angular/core';
import { LucideDynamicIcon, type LucideIconInput } from '@lucide/angular';

type LinkUnderline = 'hover' | 'always' | 'none';
type LinkTarget = '_blank' | '_parent' | '_self' | '_top';

/**
 * Text link with optional leading/trailing icon and underline behavior.
 *
 * Fixes carried over from the original: `target` no longer defaults to `_blank` — the base fork
 * forced every link (including internal/in-app ones) to open a new tab unconditionally, which is
 * rarely what you want; callers now opt in explicitly. `rel="noopener noreferrer"` is applied
 * automatically whenever `target="_blank"` is set (FTD/uiSDP added this by hand but only on the
 * base string, not derived from `target`, so it stayed correct only by coincidence). The
 * disabled state (added by FTD/uiSDP, missing from base) is merged in. Color now uses the
 * dedicated `--color-link-*` token family instead of `text-info-500` — same value, but the
 * correct semantic token instead of borrowing the info color.
 */
@Component({
  selector: 'ui-link',
  imports: [LucideDynamicIcon],
  templateUrl: './link.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class Link {
  /** Destination URL, applied as the native `href`. Omitted (or `disabled`) renders a non-navigating anchor. */
  readonly href = input<string | undefined>(undefined);
  /** Native `target` attribute. `'_blank'` automatically adds `rel="noopener noreferrer"` and an sr-only "opens in a new tab" hint. */
  readonly target = input<LinkTarget | undefined>(undefined);
  /** Underline behavior for the link text. */
  readonly underline = input<LinkUnderline>('hover');
  /** Icon shown alongside the link text. Accepts a Lucide icon component or icon data. */
  readonly icon = input<LucideIconInput | undefined>(undefined);
  /** Side the `icon` renders on, relative to the projected link text. */
  readonly iconPos = input<'left' | 'right'>('left');
  /** Strips the `href`, applies the disabled visual style, and prevents the click handler from firing. */
  readonly disabled = input(false);
  /** Extra utility classes appended to the link's computed classes. */
  readonly classNames = input('');

  /** Emits the native click event; suppressed (and navigation prevented) while `disabled`. */
  readonly clicked = output<MouseEvent>();

  protected readonly opensNewTab = computed(() => this.target() === '_blank');

  protected readonly linkClass = computed(() => {
    const base = 'inline-flex items-center gap-0.5 font-medium transition-colors';
    const underlineClass = {
      hover: 'hover:underline',
      always: 'underline',
      none: 'no-underline',
    }[this.underline()];
    const colorClass = this.disabled()
      ? 'text-link-disabled cursor-default'
      : 'text-link visited:text-link-visited hover:text-link-hover cursor-pointer';
    return `${base} ${underlineClass} ${colorClass} ${this.classNames()}`;
  });

  protected onClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    this.clicked.emit(event);
  }
}
