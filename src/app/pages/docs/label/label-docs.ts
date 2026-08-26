import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Label } from '../../../registry/label/label';
import { labelApi } from '../../../registry/label/label.api';

@Component({
  selector: 'docs-label',
  imports: [Label, ApiTable],
  templateUrl: './label-docs.html',
})
export default class LabelDocs {
  protected readonly api = labelApi;
}
