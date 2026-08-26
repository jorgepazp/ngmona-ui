import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { NumberInput } from '../../../registry/number-input/number-input';
import { numberInputApi } from '../../../registry/number-input/number-input.api';

@Component({
  selector: 'docs-number-input',
  imports: [NumberInput, ApiTable],
  templateUrl: './number-input-docs.html',
})
export default class NumberInputDocs {
  protected readonly quantity = signal(1);
  protected readonly api = numberInputApi;
}
