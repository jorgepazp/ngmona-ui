import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Button } from '../../../registry/button/button';
import { Modal } from '../../../registry/modal/modal';
import { modalApi } from '../../../registry/modal/modal.api';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';

@Component({
  selector: 'docs-modal',
  imports: [Modal, Button, UiTemplateDirective, ApiTable],
  templateUrl: './modal-docs.html',
})
export default class ModalDocs {
  protected readonly basicOpen = signal(false);
  protected readonly templatedOpen = signal(false);
  protected readonly api = modalApi;
}
