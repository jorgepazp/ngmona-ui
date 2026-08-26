import { Component, DestroyRef, computed, inject, input, output, signal } from '@angular/core';
import { LucideCheck, LucideCopy } from '@lucide/angular';

/**
 * Click-to-copy URL chip. All three source copies were identical.
 *
 * Changes from the original:
 * - `url` was a plain `@Input()` defaulting to a hardcoded `www.transbank.cl/firmacontrato/ejemplo`
 *   URL. It's now `input.required<string>()` — there is no sensible generic default for a URL.
 * - The original rendered a `<div (click)="copyUrl()">`, which is not keyboard-operable and has
 *   no accessible role — a real a11y bug. It's now a real `<button type="button">`.
 * - The "copied" feedback was a `tbk-notification` toast in the top-right corner of the *page*,
 *   entirely disconnected from the control that triggered it. That component isn't part of this
 *   migration batch (and pulling in a whole toast/notification system for one chip is overkill
 *   for a copy-paste primitive), so feedback is now inline: the icon and trailing label swap to a
 *   checkmark + `copiedLabel` for `duration` ms, then revert. This also fixes a dead `showNotification`
 *   input that was declared but never actually read anywhere in the original template — the
 *   notification always showed regardless of its value.
 * - `notificationText` (Spanish default "Enlace copiado") is renamed `copiedLabel` (default
 *   "Copied!"); `label` default is now "Copy URL" instead of "Copiar URL" — component defaults
 *   are English now, same as Button/Checkbox.
 * - Adds a `copied` output so consumers can react (e.g. analytics) without polling clipboard state.
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
