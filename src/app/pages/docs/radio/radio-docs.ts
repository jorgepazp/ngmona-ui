import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Radio } from '../../../registry/radio/radio';
import { radioApi } from '../../../registry/radio/radio.api';

@Component({
  selector: 'docs-radio',
  imports: [Radio, ApiTable, CodeTabs],
  templateUrl: './radio-docs.html',
})
export default class RadioDocs {
  protected readonly picked = signal('a');
  protected readonly api = radioApi;

  protected readonly basicHtml = `<ui-radio name="group" value="a" [checked]="picked() === 'a'" (selected)="picked.set('a')" label="Option A"></ui-radio>
<ui-radio name="group" value="b" [checked]="picked() === 'b'" (selected)="picked.set('b')" label="Option B"></ui-radio>
<ui-radio name="group" value="c" [checked]="picked() === 'c'" (selected)="picked.set('c')" label="Disabled" [disabled]="true"></ui-radio>
<p>picked = {{ picked() }}</p>`;

  protected readonly basicTs = `import { Component, signal } from '@angular/core';
import { Radio } from './ui/radio/radio';

@Component({
  selector: 'app-plan-picker',
  imports: [Radio],
  templateUrl: './plan-picker.html',
})
export class PlanPicker {
  picked = signal('a');
}`;
}
