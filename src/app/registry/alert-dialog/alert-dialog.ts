import { Component, input, output } from '@angular/core';
import { Button } from '../button/button';
import { Modal } from '../modal/modal';

let nextId = 0;

export type AlertDialogVariant = 'default' | 'danger';

/**
 * Confirmation dialog built on top of `Modal` rather than duplicating its focus-trap/backdrop/
 * animation logic. Two ARIA-driven differences from a plain `Modal`:
 *  - renders with `role="alertdialog"` (via the `role` input added to `Modal` for this purpose)
 *    instead of `role="dialog"`, and
 *  - the `message` is wired to the panel's `aria-describedby` (via `Modal`'s new `describedBy`
 *    input) so assistive tech reads the consequence of the action along with the heading.
 *
 * Unlike `Modal`, content isn't arbitrary — `message` plus explicit confirm/cancel actions only.
 * `closeOnBackdrop` defaults to `false` (unlike `Modal`'s default of `true`): a destructive
 * confirmation shouldn't be dismissible by an accidental click outside it. Escape still cancels,
 * matching the standard alertdialog pattern where Escape is equivalent to the Cancel action.
 */
@Component({
  selector: 'ui-alert-dialog',
  imports: [Modal, Button],
  templateUrl: './alert-dialog.html',
})
export class AlertDialog {
  /** Controls dialog visibility, same as `Modal`'s `open` — the caller owns this and reacts to `confirmed`/`cancelled`. */
  readonly open = input(false);
  /** Dialog title, rendered in the header and read first by assistive tech. */
  readonly heading = input.required<string>();
  /** Body text describing the consequence of the action; wired to the panel's `aria-describedby`. */
  readonly message = input('');
  /** Label for the confirm button. */
  readonly confirmLabel = input('Confirm');
  /** Label for the cancel button. */
  readonly cancelLabel = input('Cancel');
  /** `'danger'` styles the confirm button destructively, for irreversible actions like deletion. */
  readonly variant = input<AlertDialogVariant>('default');
  /** Whether clicking the backdrop cancels the dialog. Defaults to `false`, unlike `Modal`. */
  readonly closeOnBackdrop = input(false);
  /** Shows an `X` close button in the header; clicking it cancels, same as Escape. */
  readonly showCloseButton = input(false);
  /** Disables the cancel button and shows a loading state on the confirm button while an async confirm is in flight. */
  readonly loading = input(false);
  /** Extra utility classes appended to the underlying `Modal` panel. */
  readonly classNames = input('');

  /** Fires when the confirm button is clicked. */
  readonly confirmed = output<void>();
  /** Fires when the cancel button is clicked, the backdrop is clicked (if `closeOnBackdrop`), the close button is clicked, or Escape is pressed. */
  readonly cancelled = output<void>();

  protected readonly descriptionId = `ui-alert-dialog-desc-${nextId++}`;

  protected confirmClass(): string {
    return this.variant() === 'danger'
      ? '!bg-danger-500 hover:!bg-danger-600 active:!bg-danger-800 [&:not(:active)]:focus:!outline-danger-500'
      : '';
  }

  protected confirm(): void {
    this.confirmed.emit();
  }

  protected cancel(): void {
    this.cancelled.emit();
  }
}
