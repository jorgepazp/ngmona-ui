import { Component, input, output } from '@angular/core';
import { Button } from '../button/button';
import { Modal } from '../modal/modal';

let nextId = 0;

export type AlertDialogVariant = 'default' | 'danger';

/**
 * Confirmation dialog for actions that need an explicit confirm or cancel, such as deleting a
 * record. Use it instead of `Modal` when the content is a `heading`, a `message` and two actions,
 * rather than arbitrary projected content.
 *
 * Renders with `role="alertdialog"` and exposes `message` through `aria-describedby` so assistive
 * technology reads it together with the heading. Clicking the backdrop does not dismiss the
 * dialog by default; Escape and the Cancel button both emit `cancelled`.
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
