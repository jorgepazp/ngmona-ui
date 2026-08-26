import { Component, signal } from '@angular/core';
import { LucideMail } from '@lucide/angular';
import { Input } from '../../../registry/input/input';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { inputApi } from '../../../registry/input/input.api';

@Component({
  selector: 'docs-input',
  imports: [Input, ApiTable],
  templateUrl: './input-docs.html',
})
export default class InputDocs {
  protected readonly mailIcon = LucideMail;
  protected readonly text = signal('');
  protected readonly countries = ['Argentina', 'Chile', 'Uruguay', 'Brazil', 'Paraguay'];
  protected readonly api = inputApi;
}
