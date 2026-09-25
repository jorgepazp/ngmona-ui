import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Button } from '../../../registry/button/button';
import { Modal } from '../../../registry/modal/modal';
import { modalApi } from '../../../registry/modal/modal.api';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';

@Component({
  selector: 'docs-modal',
  imports: [Modal, Button, UiTemplateDirective, ApiTable, CodeTabs],
  templateUrl: './modal-docs.html',
})
export default class ModalDocs {
  protected readonly basicOpen = signal(false);
  protected readonly templatedOpen = signal(false);
  protected readonly api = modalApi;

  protected readonly basicHtml = `<ui-button (clicked)="basicOpen.set(true)">Open modal</ui-button>

<ui-modal [open]="basicOpen()" heading="Delete item" (closed)="basicOpen.set(false)">
  <p>This action can't be undone. Are you sure you want to delete this item?</p>
  <div class="!mt-8 flex justify-end gap-4">
    <ui-button variant="secondary" (clicked)="basicOpen.set(false)">Cancel</ui-button>
    <ui-button (clicked)="basicOpen.set(false)">Delete</ui-button>
  </div>
</ui-modal>`;

  protected readonly basicTs = `import { Component, signal } from '@angular/core';
import { Button } from './ui/button/button';
import { Modal } from './ui/modal/modal';

@Component({
  selector: 'app-delete-item',
  imports: [Modal, Button],
  templateUrl: './delete-item.html',
})
export class DeleteItem {
  basicOpen = signal(false);
}`;

  protected readonly templatedHtml = `<ui-button variant="secondary" (clicked)="templatedOpen.set(true)">
  Open templated modal
</ui-button>

<ui-modal [open]="templatedOpen()" [showCloseButton]="false" (closed)="templatedOpen.set(false)">
  <ng-template uiTemplate="header">
    <h2 class="text-heading-sm !mb-4">Custom header</h2>
  </ng-template>
  <ng-template uiTemplate="content">
    <p>Content, header and footer are all separate named templates.</p>
  </ng-template>
  <ng-template uiTemplate="footer">
    <div class="!mt-8 flex justify-end">
      <ui-button (clicked)="templatedOpen.set(false)">Got it</ui-button>
    </div>
  </ng-template>
</ui-modal>`;

  protected readonly templatedTs = `import { Component, signal } from '@angular/core';
import { Button } from './ui/button/button';
import { Modal } from './ui/modal/modal';
import { UiTemplateDirective } from './ui/shared/ui-template.directive';

@Component({
  selector: 'app-templated-modal',
  imports: [Modal, Button, UiTemplateDirective],
  templateUrl: './templated-modal.html',
})
export class TemplatedModal {
  templatedOpen = signal(false);
}`;
}
