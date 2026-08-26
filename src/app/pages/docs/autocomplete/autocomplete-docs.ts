import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Autocomplete } from '../../../registry/autocomplete/autocomplete';
import { autocompleteApi } from '../../../registry/autocomplete/autocomplete.api';

@Component({
  selector: 'docs-autocomplete',
  imports: [Autocomplete, ApiTable],
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
}
