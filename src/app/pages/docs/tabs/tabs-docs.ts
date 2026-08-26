import { Component } from '@angular/core';
import { LucideSettings, LucideUser } from '@lucide/angular';
import { Tabs } from '../../../registry/tabs/tabs';
import { tabsApi } from '../../../registry/tabs/tabs.api';
import { TabPanel } from '../../../registry/tabs/tab-panel/tab-panel';
import { tabPanelApi } from '../../../registry/tabs/tab-panel/tab-panel.api';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';
import { ApiTable } from '../../../docs-ui/api-table/api-table';

@Component({
  selector: 'docs-tabs',
  imports: [Tabs, TabPanel, UiTemplateDirective, ApiTable],
  templateUrl: './tabs-docs.html',
})
export default class TabsDocs {
  protected readonly userIcon = LucideUser;
  protected readonly settingsIcon = LucideSettings;
  protected readonly api = tabsApi;
  protected readonly tabPanelApi = tabPanelApi;
}
