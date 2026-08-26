import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Radio } from '../../../registry/radio/radio';
import { radioApi } from '../../../registry/radio/radio.api';

@Component({
  selector: 'docs-radio',
  imports: [Radio, ApiTable],
  templateUrl: './radio-docs.html',
})
export default class RadioDocs {
  protected readonly picked = signal('a');
  protected readonly api = radioApi;
}
