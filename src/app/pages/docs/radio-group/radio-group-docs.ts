import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { RadioGroup } from '../../../registry/radio-group/radio-group';
import { radioGroupApi } from '../../../registry/radio-group/radio-group.api';

@Component({
  selector: 'docs-radio-group',
  imports: [RadioGroup, FormsModule, ApiTable],
  templateUrl: './radio-group-docs.html',
})
export default class RadioGroupDocs {
  protected fruit: string | undefined;
  protected readonly options = ['Apple', 'Banana', 'Cherry', 'Durian'];
  protected readonly api = radioGroupApi;
}
