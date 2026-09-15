import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Table, TableCell, TableHeadCell, TableRow } from '../../../registry/table/table';
import { tableApi } from '../../../registry/table/table.api';

@Component({
  selector: 'docs-table',
  imports: [Table, TableRow, TableHeadCell, TableCell, ApiTable, CodeTabs],
  templateUrl: './table-docs.html',
})
export default class TableDocs {
  protected readonly rows = [
    { name: 'Ada Lovelace', role: 'Engineer' },
    { name: 'Grace Hopper', role: 'Admiral' },
    { name: 'Katherine Johnson', role: 'Mathematician' },
  ];
  protected readonly api = tableApi;

  protected readonly basicHtml = `<ui-table>
  <thead>
    <tr uiTableRow>
      <th uiTableHeadCell>Name</th>
      <th uiTableHeadCell>Role</th>
    </tr>
  </thead>
  <tbody>
    @for (row of rows; track row.name) {
      <tr uiTableRow>
        <td uiTableCell>{{ row.name }}</td>
        <td uiTableCell>{{ row.role }}</td>
      </tr>
    }
  </tbody>
</ui-table>`;

  protected readonly basicTs = `import { Component } from '@angular/core';
import { Table, TableCell, TableHeadCell, TableRow } from './ui/table/table';

@Component({
  selector: 'app-people-table',
  imports: [Table, TableRow, TableHeadCell, TableCell],
  templateUrl: './people-table.html',
})
export class PeopleTable {
  rows = [
    { name: 'Ada Lovelace', role: 'Engineer' },
    { name: 'Grace Hopper', role: 'Admiral' },
    { name: 'Katherine Johnson', role: 'Mathematician' },
  ];
}`;
}
