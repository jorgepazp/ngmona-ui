import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Autocomplete } from '../../../registry/autocomplete/autocomplete';
import { autocompleteApi } from '../../../registry/autocomplete/autocomplete.api';

@Component({
  selector: 'docs-autocomplete',
  imports: [Autocomplete, ApiTable, CodeTabs],
  templateUrl: './autocomplete-docs.html',
})
export default class AutocompleteDocs {
  protected readonly api = autocompleteApi;
  protected readonly countries = [
    'Argentina',
    'Australia',
    'Austria',
    'Belgium',
    'Brazil',
    'Canada',
    'Chile',
    'Colombia',
    'Denmark',
    'Ecuador',
    'Finland',
    'France',
    'Germany',
    'Ireland',
    'Italy',
    'Japan',
    'Mexico',
    'Netherlands',
    'New Zealand',
    'Norway',
    'Peru',
    'Portugal',
    'Spain',
    'Sweden',
    'Switzerland',
    'United Kingdom',
    'United States',
    'Uruguay',
  ];

  protected readonly city = signal('');

  protected readonly basicHtml = `<ui-autocomplete
  [suggestions]="countries"
  [(value)]="city"
  placeholder="Type a country…"
  label="Country"
  caption="You can type anything; suggestions are just an assist."
></ui-autocomplete>`;

  protected readonly basicTs = `import { Component, signal } from '@angular/core';
import { Autocomplete } from './ui/autocomplete/autocomplete';

@Component({
  selector: 'app-country-picker',
  imports: [Autocomplete],
  templateUrl: './country-picker.html',
})
export class CountryPicker {
  countries = ['Argentina', 'Australia', 'Austria', /* ... */];
  city = signal('');
}`;
}
