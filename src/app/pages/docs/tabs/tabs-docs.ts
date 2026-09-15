import { Component } from '@angular/core';
import { LucideSettings, LucideUser } from '@lucide/angular';
import { Tabs } from '../../../registry/tabs/tabs';
import { tabsApi } from '../../../registry/tabs/tabs.api';
import { TabPanel } from '../../../registry/tabs/tab-panel/tab-panel';
import { tabPanelApi } from '../../../registry/tabs/tab-panel/tab-panel.api';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';

@Component({
  selector: 'docs-tabs',
  imports: [Tabs, TabPanel, UiTemplateDirective, ApiTable, CodeTabs],
  templateUrl: './tabs-docs.html',
})
export default class TabsDocs {
  protected readonly userIcon = LucideUser;
  protected readonly settingsIcon = LucideSettings;
  protected readonly api = tabsApi;
  protected readonly tabPanelApi = tabPanelApi;

  protected readonly basicHtml = `<ui-tabs>
  <ui-tab-panel value="account" label="Account" [icon]="userIcon">
    <p>Manage your account details here.</p>
  </ui-tab-panel>
  <ui-tab-panel value="settings" label="Settings" [icon]="settingsIcon">
    <p>Adjust your preferences here.</p>
  </ui-tab-panel>
  <ui-tab-panel value="billing" label="Billing" [disabled]="true">
    <p>This tab is disabled.</p>
  </ui-tab-panel>
</ui-tabs>`;

  protected readonly basicTs = `import { Component } from '@angular/core';
import { LucideSettings, LucideUser } from '@lucide/angular';
import { Tabs } from './ui/tabs/tabs';
import { TabPanel } from './ui/tabs/tab-panel/tab-panel';

@Component({
  selector: 'app-account-tabs',
  imports: [Tabs, TabPanel],
  templateUrl: './account-tabs.html',
})
export class AccountTabs {
  userIcon = LucideUser;
  settingsIcon = LucideSettings;
}`;

  protected readonly verticalHtml = `<ui-tabs orientation="vertical">
  <ui-tab-panel value="overview">
    <ng-template uiTemplate="label">
      <span class="font-bold">Overview</span>
    </ng-template>
    <p>Summary content goes here.</p>
  </ui-tab-panel>
  <ui-tab-panel value="activity" label="Activity">
    <p>Recent activity goes here.</p>
  </ui-tab-panel>
</ui-tabs>`;

  protected readonly verticalTs = `import { Component } from '@angular/core';
import { Tabs } from './ui/tabs/tabs';
import { TabPanel } from './ui/tabs/tab-panel/tab-panel';
import { UiTemplateDirective } from './ui/shared/ui-template.directive';

@Component({
  selector: 'app-vertical-tabs',
  imports: [Tabs, TabPanel, UiTemplateDirective],
  templateUrl: './vertical-tabs.html',
})
export class VerticalTabs {}`;
}
