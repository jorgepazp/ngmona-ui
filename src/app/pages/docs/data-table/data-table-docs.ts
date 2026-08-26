import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
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
  imports: [DataTable, UiTemplateDirective, Button, ApiTable, Badge],
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
}
