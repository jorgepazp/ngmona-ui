import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Button } from '../../../registry/button/button';
import { dataTableApi } from '../../../registry/data-table/data-table.api';
import { DataTable, DataTableColumn } from '../../../registry/data-table/data-table';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';
import { Badge, BadgeVariant } from "../../../registry/badge/badge";

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'invited' | 'suspended';
}

const STATUSES: User['status'][] = ['active', 'invited', 'suspended'];

function makeUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: STATUSES[i % STATUSES.length],
  }));
}

@Component({
  selector: 'docs-data-table',
  imports: [DataTable, UiTemplateDirective, Button, ApiTable, Badge, CodeTabs],
  templateUrl: './data-table-docs.html',
})
export default class DataTableDocs {
  protected readonly api = dataTableApi;
  protected readonly users = signal(makeUsers(37));
  protected readonly columns: DataTableColumn<User>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'status', header: 'Status', sortable: true },
  ];
  protected readonly selected = signal<User[]>([]);
  protected readonly loading = signal(false);

  protected readonly rowKey = (row: User) => row.id;

  protected toggleLoading(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 900);
  }

  protected clearData(): void {
    this.users.set([]);
  }

  protected resetData(): void {
    this.users.set(makeUsers(37));
  }

  protected statusClass(status: User['status']): BadgeVariant {
    switch (status) {
      case 'active':
        return 'success';
      case 'invited':
        return 'info';
      case 'suspended':
        return 'danger';
    }
  }

  protected readonly basicHtml = `<ui-data-table
  [data]="users()"
  [columns]="columns"
  [rowKey]="rowKey"
  selectable="multi"
  [(selected)]="selected"
  [loading]="loading()"
  [pageSize]="10"
  ariaLabel="Users"
>
  <ng-template uiTemplate="cell-status" let-row>
    <ui-badge [variant]="statusClass(row.status)">{{ row.status }}</ui-badge>
  </ng-template>
  <ng-template uiTemplate="empty">
    <span>No users match; try adjusting your search.</span>
  </ng-template>
</ui-data-table>`;

  protected readonly basicTs = `import { Component, signal } from '@angular/core';
import { Badge, type BadgeVariant } from './ui/badge/badge';
import { DataTable, type DataTableColumn } from './ui/data-table/data-table';
import { UiTemplateDirective } from './ui/shared/ui-template.directive';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'invited' | 'suspended';
}

@Component({
  selector: 'app-users-table',
  imports: [DataTable, UiTemplateDirective, Badge],
  templateUrl: './users-table.html',
})
export class UsersTable {
  users = signal<User[]>([/* ... */]);
  columns: DataTableColumn<User>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'status', header: 'Status', sortable: true },
  ];
  selected = signal<User[]>([]);
  loading = signal(false);
  rowKey = (row: User) => row.id;

  statusClass(status: User['status']): BadgeVariant {
    switch (status) {
      case 'active':
        return 'success';
      case 'invited':
        return 'info';
      case 'suspended':
        return 'danger';
    }
  }
}`;
}
