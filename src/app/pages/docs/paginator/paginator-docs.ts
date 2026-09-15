import { Component, computed, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Paginator } from '../../../registry/paginator/paginator';
import { paginatorApi } from '../../../registry/paginator/paginator.api';

@Component({
  selector: 'docs-paginator',
  imports: [Paginator, ApiTable, CodeTabs],
  templateUrl: './paginator-docs.html',
})
export default class PaginatorDocs {
  protected readonly api = paginatorApi;
  protected readonly items = Array.from({ length: 132 }, (_, i) => `Item ${i + 1}`);
  protected readonly pageSize = 10;

  protected readonly page = signal(0);
  protected readonly pageCount = computed(() => Math.ceil(this.items.length / this.pageSize));
  protected readonly pageItems = computed(() => {
    const start = this.page() * this.pageSize;
    return this.items.slice(start, start + this.pageSize);
  });

  protected readonly manyPagesCurrent = signal(6);

  protected readonly basicHtml = `<ul>
  @for (item of pageItems(); track item) {
    <li>{{ item }}</li>
  }
</ul>
<ui-paginator [(page)]="page" [pageCount]="pageCount()"></ui-paginator>`;

  protected readonly basicTs = `import { Component, computed, signal } from '@angular/core';
import { Paginator } from './ui/paginator/paginator';

@Component({
  selector: 'app-item-list',
  imports: [Paginator],
  templateUrl: './item-list.html',
})
export class ItemList {
  items = Array.from({ length: 132 }, (_, i) => \`Item \${i + 1}\`);
  pageSize = 10;

  page = signal(0);
  pageCount = computed(() => Math.ceil(this.items.length / this.pageSize));
  pageItems = computed(() => {
    const start = this.page() * this.pageSize;
    return this.items.slice(start, start + this.pageSize);
  });
}`;

  protected readonly manyPagesHtml = `<ui-paginator [(page)]="manyPagesCurrent" [pageCount]="40" [siblingCount]="2"></ui-paginator>`;

  protected readonly manyPagesTs = `import { Component, signal } from '@angular/core';
import { Paginator } from './ui/paginator/paginator';

@Component({
  selector: 'app-wide-paginator',
  imports: [Paginator],
  templateUrl: './wide-paginator.html',
})
export class WidePaginator {
  manyPagesCurrent = signal(6);
}`;

  protected readonly disabledHtml = `<ui-paginator [page]="2" [pageCount]="10" [disabled]="true"></ui-paginator>`;

  protected readonly disabledTs = `import { Component } from '@angular/core';
import { Paginator } from './ui/paginator/paginator';

@Component({
  selector: 'app-disabled-paginator',
  imports: [Paginator],
  templateUrl: './disabled-paginator.html',
})
export class DisabledPaginator {}`;
}
