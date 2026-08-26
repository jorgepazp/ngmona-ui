import { Component, inject } from '@angular/core';
import { Button } from '../../../registry/button/button';
import { ToastService } from '../../../registry/toast/toast.service';
import { toasterApi } from '../../../registry/toast/toaster.api';
import { ApiTable } from '../../../docs-ui/api-table/api-table';

@Component({
  selector: 'docs-toast',
  imports: [Button, ApiTable],
  templateUrl: './toast-docs.html',
})
export default class ToastDocs {
  protected readonly toast = inject(ToastService);
  protected readonly api = toasterApi;
}
