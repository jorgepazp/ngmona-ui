import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Checkbox } from '../../../registry/checkbox/checkbox';
import { checkboxApi } from '../../../registry/checkbox/checkbox.api';

@Component({
  selector: 'docs-checkbox',
  imports: [Checkbox, ApiTable],
  templateUrl: './checkbox-docs.html',
})
export default class CheckboxDocs {
  protected readonly isChecked = signal(true);
  protected readonly api = checkboxApi;
}
