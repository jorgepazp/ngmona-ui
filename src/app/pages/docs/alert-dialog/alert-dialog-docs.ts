import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { AlertDialog } from '../../../registry/alert-dialog/alert-dialog';
import { alertDialogApi } from '../../../registry/alert-dialog/alert-dialog.api';
import { Button } from '../../../registry/button/button';

@Component({
  selector: 'docs-alert-dialog',
  imports: [AlertDialog, Button, ApiTable],
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
}
