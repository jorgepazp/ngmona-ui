import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { AlertDialog } from '../../../registry/alert-dialog/alert-dialog';
import { alertDialogApi } from '../../../registry/alert-dialog/alert-dialog.api';
import { Button } from '../../../registry/button/button';

@Component({
  selector: 'docs-alert-dialog',
  imports: [AlertDialog, Button, ApiTable, CodeTabs],
  templateUrl: './alert-dialog-docs.html',
})
export default class AlertDialogDocs {
  protected readonly defaultOpen = signal(false);
  protected readonly dangerOpen = signal(false);
  protected readonly loading = signal(false);
  protected readonly api = alertDialogApi;

  protected confirmDelete(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.dangerOpen.set(false);
    }, 1200);
  }

  protected readonly basicHtml = `<ui-button (clicked)="defaultOpen.set(true)">Leave page</ui-button>

<ui-alert-dialog
  [open]="defaultOpen()"
  heading="Leave without saving?"
  message="You have unsaved changes. If you leave now, they'll be lost."
  confirmLabel="Leave"
  cancelLabel="Stay"
  (confirmed)="defaultOpen.set(false)"
  (cancelled)="defaultOpen.set(false)"
></ui-alert-dialog>`;

  protected readonly basicTs = `import { Component, signal } from '@angular/core';
import { AlertDialog } from './ui/alert-dialog/alert-dialog';
import { Button } from './ui/button/button';

@Component({
  selector: 'app-leave-page',
  imports: [AlertDialog, Button],
  templateUrl: './leave-page.html',
})
export class LeavePage {
  defaultOpen = signal(false);
}`;

  protected readonly dangerHtml = `<ui-button variant="secondary" (clicked)="dangerOpen.set(true)">Delete account</ui-button>

<ui-alert-dialog
  [open]="dangerOpen()"
  heading="Delete account"
  message="This action can't be undone. This will permanently delete your account and all associated data."
  confirmLabel="Delete"
  variant="danger"
  [loading]="loading()"
  (confirmed)="confirmDelete()"
  (cancelled)="dangerOpen.set(false)"
></ui-alert-dialog>`;

  protected readonly dangerTs = `import { Component, signal } from '@angular/core';
import { AlertDialog } from './ui/alert-dialog/alert-dialog';
import { Button } from './ui/button/button';

@Component({
  selector: 'app-delete-account',
  imports: [AlertDialog, Button],
  templateUrl: './delete-account.html',
})
export class DeleteAccount {
  dangerOpen = signal(false);
  loading = signal(false);

  confirmDelete(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.dangerOpen.set(false);
    }, 1200);
  }
}`;
}
