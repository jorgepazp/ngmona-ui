import { Component, inject } from '@angular/core';
import { Button } from '../../../registry/button/button';
import { ToastService } from '../../../registry/toast/toast.service';
import { toasterApi } from '../../../registry/toast/toaster.api';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';

@Component({
  selector: 'docs-toast',
  imports: [Button, ApiTable, CodeTabs],
  templateUrl: './toast-docs.html',
})
export default class ToastDocs {
  protected readonly toast = inject(ToastService);
  protected readonly api = toasterApi;

  protected readonly basicHtml = `<!-- once, in the app shell -->
<ui-toaster />

<!-- anywhere else -->
<ui-button (clicked)="toast.success('Saved successfully')">Save</ui-button>`;

  protected readonly basicTs = `import { Component, inject } from '@angular/core';
import { Button } from './ui/button/button';
import { Toaster } from './ui/toast/toaster';
import { ToastService } from './ui/toast/toast.service';

@Component({
  selector: 'app-shell',
  imports: [Toaster],
  templateUrl: './app-shell.html',
})
export class AppShell {}

@Component({
  selector: 'app-save-button',
  imports: [Button],
  templateUrl: './save-button.html',
})
export class SaveButton {
  toast = inject(ToastService);
}`;
}
