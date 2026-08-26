import { Component } from '@angular/core';
import { LucideDynamicIcon, LucideSearch } from '@lucide/angular';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Button } from '../../../registry/button/button';
import { InputGroup } from '../../../registry/input-group/input-group';
import { inputGroupApi } from '../../../registry/input-group/input-group.api';

@Component({
  selector: 'docs-input-group',
  imports: [InputGroup, Button, LucideDynamicIcon, ApiTable],
  templateUrl: './input-group-docs.html',
})
export default class InputGroupDocs {
  protected readonly searchIcon = LucideSearch;
  protected readonly api = inputGroupApi;
}
