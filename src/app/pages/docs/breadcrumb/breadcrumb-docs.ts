import { Component } from '@angular/core';
import { LucideHouse } from '@lucide/angular';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Breadcrumb, type BreadcrumbItem } from '../../../registry/breadcrumb/breadcrumb';
import { breadcrumbApi } from '../../../registry/breadcrumb/breadcrumb.api';

@Component({
  selector: 'docs-breadcrumb',
  imports: [Breadcrumb, ApiTable, CodeTabs],
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

  protected readonly basicHtml = `<ui-breadcrumb [items]="basicItems" (itemClick)="onItemClick($event)"></ui-breadcrumb>`;

  protected readonly basicTs = `import { Component } from '@angular/core';
import { Breadcrumb, type BreadcrumbItem } from './ui/breadcrumb/breadcrumb';

@Component({
  selector: 'app-page-breadcrumb',
  imports: [Breadcrumb],
  templateUrl: './page-breadcrumb.html',
})
export class PageBreadcrumb {
  basicItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Components', href: '/components' },
    { label: 'Breadcrumb' },
  ];

  onItemClick(payload: { item: BreadcrumbItem; index: number }): void {
    console.log('breadcrumb item clicked', payload.item.label, payload.index);
  }
}`;

  protected readonly iconHtml = `<ui-breadcrumb [items]="iconItems"></ui-breadcrumb>`;

  protected readonly iconTs = `import { Component } from '@angular/core';
import { LucideHouse } from '@lucide/angular';
import { Breadcrumb, type BreadcrumbItem } from './ui/breadcrumb/breadcrumb';

@Component({
  selector: 'app-breadcrumb-with-icon',
  imports: [Breadcrumb],
  templateUrl: './breadcrumb-with-icon.html',
})
export class BreadcrumbWithIcon {
  iconItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: LucideHouse },
    { label: 'Docs', href: '/docs' },
    { label: 'Breadcrumb' },
  ];
}`;

  protected readonly deepHtml = `<ui-breadcrumb [items]="deepItems"></ui-breadcrumb>`;

  protected readonly deepTs = `import { Component } from '@angular/core';
import { Breadcrumb, type BreadcrumbItem } from './ui/breadcrumb/breadcrumb';

@Component({
  selector: 'app-deep-breadcrumb',
  imports: [Breadcrumb],
  templateUrl: './deep-breadcrumb.html',
})
export class DeepBreadcrumb {
  deepItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Library', href: '/library' },
    { label: 'Data', href: '/library/data' },
    { label: 'Reports', href: '/library/data/reports' },
    { label: 'Q3 summary' },
  ];
}`;
}
