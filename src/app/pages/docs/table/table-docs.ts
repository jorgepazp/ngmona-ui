import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Table, TableCell, TableHeadCell, TableRow } from '../../../registry/table/table';
import { tableApi } from '../../../registry/table/table.api';

@Component({
  selector: 'docs-table',
  imports: [Table, TableRow, TableHeadCell, TableCell, ApiTable],
  templateUrl: './table-docs.html',
})
export default class TableDocs {
  protected readonly rows = [
    { name: 'Ada Lovelace', role: 'Engineer' },
    { name: 'Grace Hopper', role: 'Admiral' },
    { name: 'Katherine Johnson', role: 'Mathematician' },
  ];
  protected readonly api = tableApi;
}
