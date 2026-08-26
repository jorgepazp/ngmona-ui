import { Component, computed, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Paginator } from '../../../registry/paginator/paginator';
import { paginatorApi } from '../../../registry/paginator/paginator.api';

@Component({
  selector: 'docs-paginator',
  imports: [Paginator, ApiTable],
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
}
