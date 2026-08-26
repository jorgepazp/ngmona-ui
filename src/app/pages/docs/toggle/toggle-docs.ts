import { Component, signal } from '@angular/core';
import { Toggle } from '../../../registry/toggle/toggle';
import { toggleApi } from '../../../registry/toggle/toggle.api';
import { ApiTable } from '../../../docs-ui/api-table/api-table';

@Component({
  selector: 'docs-toggle',
  imports: [Toggle, ApiTable],
  templateUrl: './toggle-docs.html',
})
export default class ToggleDocs {
  protected readonly on = signal(true);
  protected readonly api = toggleApi;
}
