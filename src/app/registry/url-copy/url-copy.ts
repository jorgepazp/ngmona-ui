import { Component, DestroyRef, computed, inject, input, output, signal } from '@angular/core';
import { LucideCheck, LucideCopy } from '@lucide/angular';

/**
 * Click-to-copy URL chip. Copies `url` to the clipboard when clicked, and shows `copiedLabel` in
 * place of `label` for `duration` ms as feedback.
 *
 * Emits `copied` once the URL has been successfully written to the clipboard, so callers can
 * react, for example to log analytics.
 */
@Component({
  selector: 'ui-url-copy',
  imports: [LucideCheck, LucideCopy],
  templateUrl: './url-copy.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class UrlCopy {
  /** URL copied to the clipboard when the chip is clicked. */
  readonly url = input.required<string>();
  /** Label shown before copying. */
  readonly label = input('Copy URL');
  /** Label shown in place of `label` for `duration` ms after a successful copy. */
  readonly copiedLabel = input('Copied!');
  /** How long, in ms, the "copied" feedback state is shown before reverting to `label`. */
  readonly duration = input(2000);
  /** Extra utility classes appended to the host button. */
  readonly classNames = input('');

  /** Emits once the URL has been successfully written to the clipboard. */
  readonly copied = output<void>();

  protected readonly isCopied = signal(false);
  protected readonly displayLabel = computed(() => (this.isCopied() ? this.copiedLabel() : this.label()));

  private readonly destroyRef = inject(DestroyRef);
  private revertTimeout?: ReturnType<typeof setTimeout>;

  protected readonly copyIcon = LucideCopy;
  protected readonly checkIcon = LucideCheck;

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.revertTimeout));
  }

  protected async copyUrl(): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return;
    }
    await navigator.clipboard.writeText(this.url());
    this.isCopied.set(true);
    this.copied.emit();
    clearTimeout(this.revertTimeout);
    this.revertTimeout = setTimeout(() => this.isCopied.set(false), this.duration());
  }
}
