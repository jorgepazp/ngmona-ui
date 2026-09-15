import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Avatar } from '../../../registry/avatar/avatar';
import { Sidebar } from '../../../registry/sidebar/sidebar';
import { sidebarApi } from '../../../registry/sidebar/sidebar.api';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';

@Component({
  selector: 'docs-sidebar',
  imports: [Sidebar, Avatar, UiTemplateDirective, ApiTable, CodeTabs],
  templateUrl: './sidebar-docs.html',
})
export default class SidebarDocs {
  protected readonly api = sidebarApi;
  protected readonly links = ['Dashboard', 'Projects', 'Team', 'Settings'];

  protected readonly basicHtml = `<ui-sidebar title="Acme Inc" breakpoint="md">
  <ng-template uiTemplate="header">
    <div class="flex items-center gap-2">
      <ui-avatar initials="AC" size="sm" alt="Acme Inc"></ui-avatar>
      <span class="font-medium">Acme Inc</span>
    </div>
  </ng-template>

  <ng-template uiTemplate="content">
    <ul>
      @for (link of links; track link) {
        <li><a href="#">{{ link }}</a></li>
      }
    </ul>
  </ng-template>

  <ng-template uiTemplate="footer">
    <div class="flex items-center gap-2">
      <ui-avatar initials="JD" size="sm" alt="Jamie Doe"></ui-avatar>
      <span>Jamie Doe</span>
    </div>
  </ng-template>

  <router-outlet />
</ui-sidebar>`;

  protected readonly basicTs = `import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Avatar } from './ui/avatar/avatar';
import { Sidebar } from './ui/sidebar/sidebar';
import { UiTemplateDirective } from './ui/shared/ui-template.directive';

@Component({
  selector: 'app-shell',
  imports: [Sidebar, Avatar, UiTemplateDirective, RouterOutlet],
  templateUrl: './app-shell.html',
})
export class AppShell {
  links = ['Dashboard', 'Projects', 'Team', 'Settings'];
}`;
}
