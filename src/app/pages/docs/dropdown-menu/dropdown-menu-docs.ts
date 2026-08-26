import { Component } from '@angular/core';
import { DropdownMenu } from '../../../registry/dropdown-menu/dropdown-menu';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { dropdownMenuApi } from '../../../registry/dropdown-menu/dropdown-menu.api';

@Component({
  selector: 'docs-dropdown-menu',
  imports: [DropdownMenu, UiTemplateDirective, ApiTable],
  templateUrl: './dropdown-menu-docs.html',
})
export default class DropdownMenuDocs {
  protected readonly api = dropdownMenuApi;
}
