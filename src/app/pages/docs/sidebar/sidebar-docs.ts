import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Avatar } from '../../../registry/avatar/avatar';
import { Sidebar } from '../../../registry/sidebar/sidebar';
import { sidebarApi } from '../../../registry/sidebar/sidebar.api';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';

@Component({
  selector: 'docs-sidebar',
  imports: [Sidebar, Avatar, UiTemplateDirective, ApiTable],
  templateUrl: './sidebar-docs.html',
})
export default class SidebarDocs {
  protected readonly api = sidebarApi;
  protected readonly links = ['Dashboard', 'Projects', 'Team', 'Settings'];
}
