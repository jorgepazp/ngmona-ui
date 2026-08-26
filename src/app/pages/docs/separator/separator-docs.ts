import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Separator } from '../../../registry/separator/separator';
import { separatorApi } from '../../../registry/separator/separator.api';

@Component({
  selector: 'docs-separator',
  imports: [Separator, ApiTable],
  templateUrl: './separator-docs.html',
})
export default class SeparatorDocs {
  protected readonly api = separatorApi;
}
