import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Select } from '../../../registry/select/select';
import { selectApi } from '../../../registry/select/select.api';

@Component({
  selector: 'docs-select',
  imports: [Select, ApiTable, CodeTabs],
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

  protected readonly singleHtml = `<ui-select [options]="countries" [(value)]="single" placeholder="Choose a country"></ui-select>`;

  protected readonly singleTs = `import { Component, signal } from '@angular/core';
import { Select } from './ui/select/select';

@Component({
  selector: 'app-country-select',
  imports: [Select],
  templateUrl: './country-select.html',
})
export class CountrySelect {
  countries = [
    { label: 'Argentina', value: 'ar' },
    { label: 'Chile', value: 'cl' },
    { label: 'Uruguay', value: 'uy' },
    { label: 'Brazil', value: 'br' },
  ];
  single = signal<unknown>(undefined);
}`;

  protected readonly multiHtml = `<ui-select
  [options]="countries"
  [multi]="true"
  [(value)]="multi"
  placeholder="Choose countries"
  [maxSelectableLimit]="2"
></ui-select>`;

  protected readonly multiTs = `import { Component, signal } from '@angular/core';
import { Select } from './ui/select/select';

@Component({
  selector: 'app-country-multiselect',
  imports: [Select],
  templateUrl: './country-multiselect.html',
})
export class CountryMultiselect {
  countries = [
    { label: 'Argentina', value: 'ar' },
    { label: 'Chile', value: 'cl' },
    { label: 'Uruguay', value: 'uy' },
    { label: 'Brazil', value: 'br' },
  ];
  multi = signal<unknown>([]);
}`;
}
