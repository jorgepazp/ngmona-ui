import { Component } from '@angular/core';
import { DropdownMenu } from '../../../registry/dropdown-menu/dropdown-menu';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { dropdownMenuApi } from '../../../registry/dropdown-menu/dropdown-menu.api';

@Component({
  selector: 'docs-dropdown-menu',
  imports: [DropdownMenu, UiTemplateDirective, ApiTable, CodeTabs],
  templateUrl: './dropdown-menu-docs.html',
})
export default class DropdownMenuDocs {
  protected readonly api = dropdownMenuApi;

  protected readonly basicHtml = `<ui-dropdown-menu>
  <ng-template uiTemplate="button">Options</ng-template>
  <ng-template uiTemplate="menu">
    <ul>
      <li role="menuitem" tabindex="-1">Profile</li>
      <li role="menuitem" tabindex="-1">Settings</li>
      <li role="menuitem" tabindex="-1">Log out</li>
    </ul>
  </ng-template>
</ui-dropdown-menu>`;

  protected readonly basicTs = `import { Component } from '@angular/core';
import { DropdownMenu } from './ui/dropdown-menu/dropdown-menu';
import { UiTemplateDirective } from './ui/shared/ui-template.directive';

@Component({
  selector: 'app-options-menu',
  imports: [DropdownMenu, UiTemplateDirective],
  templateUrl: './options-menu.html',
})
export class OptionsMenu {}`;

  protected readonly disabledHtml = `<ui-dropdown-menu [disabled]="true">
  <ng-template uiTemplate="button">Disabled</ng-template>
</ui-dropdown-menu>`;

  protected readonly disabledTs = `import { Component } from '@angular/core';
import { DropdownMenu } from './ui/dropdown-menu/dropdown-menu';
import { UiTemplateDirective } from './ui/shared/ui-template.directive';

@Component({
  selector: 'app-disabled-menu',
  imports: [DropdownMenu, UiTemplateDirective],
  templateUrl: './disabled-menu.html',
})
export class DisabledMenu {}`;
}
