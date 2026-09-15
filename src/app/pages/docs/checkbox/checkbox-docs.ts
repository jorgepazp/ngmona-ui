import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Checkbox } from '../../../registry/checkbox/checkbox';
import { checkboxApi } from '../../../registry/checkbox/checkbox.api';

@Component({
  selector: 'docs-checkbox',
  imports: [Checkbox, ApiTable, CodeTabs],
  templateUrl: './checkbox-docs.html',
})
export default class CheckboxDocs {
  protected readonly isChecked = signal(true);
  protected readonly api = checkboxApi;

  protected readonly bindingHtml = `<ui-checkbox [(checked)]="isChecked" label="Accept terms"></ui-checkbox>
<p>checked = {{ isChecked() }}</p>`;

  protected readonly bindingTs = `import { Component, signal } from '@angular/core';
import { Checkbox } from './ui/checkbox/checkbox';

@Component({
  selector: 'app-terms-checkbox',
  imports: [Checkbox],
  templateUrl: './terms-checkbox.html',
})
export class TermsCheckbox {
  isChecked = signal(true);
}`;

  protected readonly statesHtml = `<ui-checkbox label="Unchecked"></ui-checkbox>
<ui-checkbox [checked]="true" label="Checked"></ui-checkbox>
<ui-checkbox [disabled]="true" label="Disabled"></ui-checkbox>
<ui-checkbox [checked]="true" [disabled]="true" label="Disabled + checked"></ui-checkbox>`;

  protected readonly statesTs = `import { Component } from '@angular/core';
import { Checkbox } from './ui/checkbox/checkbox';

@Component({
  selector: 'app-checkbox-states',
  imports: [Checkbox],
  templateUrl: './checkbox-states.html',
})
export class CheckboxStates {}`;
}
