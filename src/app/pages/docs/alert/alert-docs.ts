import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Alert } from '../../../registry/alert/alert';
import { alertApi } from '../../../registry/alert/alert.api';
import { Button } from '../../../registry/button/button';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';

@Component({
  selector: 'docs-alert',
  imports: [Alert, Button, UiTemplateDirective, ApiTable, CodeTabs],
  templateUrl: './alert-docs.html',
})
export default class AlertDocs {
  protected readonly dismissibleShown = signal(true);
  protected readonly api = alertApi;

  protected readonly typesHtml = `<ui-alert type="info" heading="Heads up">This is an informational message.</ui-alert>
<ui-alert type="success" heading="Saved">Your changes were saved successfully.</ui-alert>
<ui-alert type="warning" heading="Careful">Double-check that before continuing.</ui-alert>
<ui-alert type="error" heading="Something went wrong">The request could not be completed.</ui-alert>`;

  protected readonly typesTs = `import { Component } from '@angular/core';
import { Alert } from './ui/alert/alert';

@Component({
  selector: 'app-alert-types',
  imports: [Alert],
  templateUrl: './alert-types.html',
})
export class AlertTypes {}`;

  protected readonly dismissibleHtml = `@if (dismissibleShown()) {
  <ui-alert type="warning" [dismissible]="true" (dismissed)="dismissibleShown.set(false)">
    This alert can be dismissed with the close button.
  </ui-alert>
} @else {
  <button uiButton size="sm" variant="secondary" (click)="dismissibleShown.set(true)">
    Reset dismissible example
  </button>
}`;

  protected readonly dismissibleTs = `import { Component, signal } from '@angular/core';
import { Alert } from './ui/alert/alert';
import { Button } from './ui/button/button';

@Component({
  selector: 'app-dismissible-alert',
  imports: [Alert, Button],
  templateUrl: './dismissible-alert.html',
})
export class DismissibleAlert {
  dismissibleShown = signal(true);
}`;

  protected readonly actionsHtml = `<ui-alert type="error" heading="Payment failed">
  Your card was declined. Try again or use a different payment method.
  <ng-template uiTemplate="actions">
    <button uiButton size="sm">Retry</button>
    <button uiButton size="sm" variant="secondary">Use another card</button>
  </ng-template>
</ui-alert>`;

  protected readonly actionsTs = `import { Component } from '@angular/core';
import { Alert } from './ui/alert/alert';
import { Button } from './ui/button/button';
import { UiTemplateDirective } from './ui/shared/ui-template.directive';

@Component({
  selector: 'app-alert-with-actions',
  imports: [Alert, Button, UiTemplateDirective],
  templateUrl: './alert-with-actions.html',
})
export class AlertWithActions {}`;
}
