import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { SearchInput } from '../../../registry/search-input/search-input';
import { searchInputApi } from '../../../registry/search-input/search-input.api';

@Component({
  selector: 'docs-search-input',
  imports: [SearchInput, ApiTable],
  templateUrl: './search-input-docs.html',
})
export default class SearchInputDocs {
  protected readonly query = signal('');
  protected readonly lastSearch = signal('');
  protected readonly fastLastSearch = signal('');
  protected readonly api = searchInputApi;

  protected onSearch(value: string): void {
    this.lastSearch.set(value);
  }

  protected onFastSearch(value: string): void {
    this.fastLastSearch.set(value);
  }
}
