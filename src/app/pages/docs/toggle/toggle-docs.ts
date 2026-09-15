import { Component, signal } from '@angular/core';
import { Toggle } from '../../../registry/toggle/toggle';
import { toggleApi } from '../../../registry/toggle/toggle.api';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';

@Component({
  selector: 'docs-toggle',
  imports: [Toggle, ApiTable, CodeTabs],
  templateUrl: './toggle-docs.html',
})
export default class ToggleDocs {
  protected readonly on = signal(true);
  protected readonly api = toggleApi;

  protected readonly bindingHtml = `<ui-toggle [(checked)]="on" ariaLabel="Enable notifications"></ui-toggle>
<p>on = {{ on() }}</p>`;

  protected readonly bindingTs = `import { Component, signal } from '@angular/core';
import { Toggle } from './ui/toggle/toggle';

@Component({
  selector: 'app-notification-toggle',
  imports: [Toggle],
  templateUrl: './notification-toggle.html',
})
export class NotificationToggle {
  on = signal(true);
}`;

  protected readonly colorsHtml = `<ui-toggle [checked]="true" color="default"></ui-toggle>
<ui-toggle [checked]="true" color="info"></ui-toggle>
<ui-toggle [checked]="true" color="success"></ui-toggle>
<ui-toggle [checked]="true" color="warning"></ui-toggle>
<ui-toggle [checked]="true" color="danger"></ui-toggle>`;

  protected readonly colorsTs = `import { Component } from '@angular/core';
import { Toggle } from './ui/toggle/toggle';

@Component({
  selector: 'app-toggle-colors',
  imports: [Toggle],
  templateUrl: './toggle-colors.html',
})
export class ToggleColors {}`;

  protected readonly sizesHtml = `<ui-toggle [checked]="true" size="default"></ui-toggle>
<ui-toggle [checked]="true" size="lg"></ui-toggle>
<ui-toggle [disabled]="true"></ui-toggle>`;

  protected readonly sizesTs = `import { Component } from '@angular/core';
import { Toggle } from './ui/toggle/toggle';

@Component({
  selector: 'app-toggle-sizes',
  imports: [Toggle],
  templateUrl: './toggle-sizes.html',
})
export class ToggleSizes {}`;
}
