import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Spinner } from '../../../registry/spinner/spinner';
import { spinnerApi } from '../../../registry/spinner/spinner.api';

@Component({
  selector: 'docs-spinner',
  imports: [Spinner, ApiTable],
  templateUrl: './spinner-docs.html',
})
export default class SpinnerDocs {
  protected readonly api = spinnerApi;
}
