import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Alert } from '../../../registry/alert/alert';
import { alertApi } from '../../../registry/alert/alert.api';
import { Button } from '../../../registry/button/button';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';

@Component({
  selector: 'docs-alert',
  imports: [Alert, Button, UiTemplateDirective, ApiTable],
  templateUrl: './alert-docs.html',
})
export default class AlertDocs {
  protected readonly dismissibleShown = signal(true);
  protected readonly api = alertApi;
}
