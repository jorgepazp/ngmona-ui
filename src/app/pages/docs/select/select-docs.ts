import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Select } from '../../../registry/select/select';
import { selectApi } from '../../../registry/select/select.api';

@Component({
  selector: 'docs-select',
  imports: [Select, ApiTable],
  templateUrl: './select-docs.html',
})
export default class SelectDocs {
  protected readonly countries = [
    { label: 'Argentina', value: 'ar' },
    { label: 'Chile', value: 'cl' },
    { label: 'Uruguay', value: 'uy' },
    { label: 'Brazil', value: 'br' },
  ];
  protected readonly single = signal<unknown>(undefined);
  protected readonly multi = signal<unknown>([]);
  protected readonly api = selectApi;
}
