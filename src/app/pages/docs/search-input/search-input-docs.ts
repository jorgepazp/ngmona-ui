import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { SearchInput } from '../../../registry/search-input/search-input';
import { searchInputApi } from '../../../registry/search-input/search-input.api';

@Component({
  selector: 'docs-search-input',
  imports: [SearchInput, ApiTable, CodeTabs],
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

  protected readonly basicHtml = `<ui-search-input label="Search" [(value)]="query" (search)="onSearch($event)"></ui-search-input>
<p>debounced (search) = {{ lastSearch() }}</p>`;

  protected readonly basicTs = `import { Component, signal } from '@angular/core';
import { SearchInput } from './ui/search-input/search-input';

@Component({
  selector: 'app-product-search',
  imports: [SearchInput],
  templateUrl: './product-search.html',
})
export class ProductSearch {
  query = signal('');
  lastSearch = signal('');

  onSearch(value: string): void {
    this.lastSearch.set(value);
  }
}`;

  protected readonly fastHtml = `<ui-search-input label="Fast search" [debounceMs]="100" (search)="onFastSearch($event)"></ui-search-input>`;

  protected readonly fastTs = `import { Component, signal } from '@angular/core';
import { SearchInput } from './ui/search-input/search-input';

@Component({
  selector: 'app-fast-search',
  imports: [SearchInput],
  templateUrl: './fast-search.html',
})
export class FastSearch {
  fastLastSearch = signal('');

  onFastSearch(value: string): void {
    this.fastLastSearch.set(value);
  }
}`;

  protected readonly statesHtml = `<ui-search-input label="With caption" caption="Try searching for a product"></ui-search-input>
<ui-search-input label="Disabled" [disabled]="true" value="Can't type here"></ui-search-input>`;

  protected readonly statesTs = `import { Component } from '@angular/core';
import { SearchInput } from './ui/search-input/search-input';

@Component({
  selector: 'app-search-input-states',
  imports: [SearchInput],
  templateUrl: './search-input-states.html',
})
export class SearchInputStates {}`;
}
