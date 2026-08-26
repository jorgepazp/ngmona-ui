import { Component } from '@angular/core';
import { LucideHouse } from '@lucide/angular';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Breadcrumb, type BreadcrumbItem } from '../../../registry/breadcrumb/breadcrumb';
import { breadcrumbApi } from '../../../registry/breadcrumb/breadcrumb.api';

@Component({
  selector: 'docs-breadcrumb',
  imports: [Breadcrumb, ApiTable],
  templateUrl: './breadcrumb-docs.html',
})
export default class BreadcrumbDocs {
  protected readonly api = breadcrumbApi;
  protected readonly basicItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Components', href: '/components' },
    { label: 'Breadcrumb' },
  ];

  protected readonly iconItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: LucideHouse },
    { label: 'Docs', href: '/docs' },
    { label: 'Breadcrumb' },
  ];

  protected readonly deepItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Library', href: '/library' },
    { label: 'Data', href: '/library/data' },
    { label: 'Reports', href: '/library/data/reports' },
    { label: 'Q3 summary' },
  ];

  protected onItemClick(payload: { item: BreadcrumbItem; index: number }): void {
    console.log('breadcrumb item clicked', payload.item.label, payload.index);
  }
}
