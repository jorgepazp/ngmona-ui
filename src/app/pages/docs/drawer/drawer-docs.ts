import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Drawer } from '../../../registry/drawer/drawer';
import { drawerApi } from '../../../registry/drawer/drawer.api';
import { Button } from '../../../registry/button/button';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';

@Component({
  selector: 'docs-drawer',
  imports: [Drawer, Button, UiTemplateDirective, ApiTable, CodeTabs],
  templateUrl: './drawer-docs.html',
})
export default class DrawerDocs {
  protected readonly rightOpen = signal(false);
  protected readonly leftOpen = signal(false);
  protected readonly noBackdropOpen = signal(false);
  protected readonly api = drawerApi;

  protected readonly rightHtml = `<ui-button (clicked)="rightOpen.set(true)">Open drawer</ui-button>

<ui-drawer [(open)]="rightOpen">
  <ng-template uiTemplate="header">
    <h2>Settings</h2>
  </ng-template>
  <p>Manage your notification and privacy settings here.</p>
  <ng-template uiTemplate="footer">
    <ui-button variant="secondary" (clicked)="rightOpen.set(false)">Close</ui-button>
  </ng-template>
</ui-drawer>`;

  protected readonly rightTs = `import { Component, signal } from '@angular/core';
import { Button } from './ui/button/button';
import { Drawer } from './ui/drawer/drawer';
import { UiTemplateDirective } from './ui/shared/ui-template.directive';

@Component({
  selector: 'app-settings-drawer',
  imports: [Drawer, Button, UiTemplateDirective],
  templateUrl: './settings-drawer.html',
})
export class SettingsDrawer {
  rightOpen = signal(false);
}`;

  protected readonly leftHtml = `<ui-button variant="secondary" (clicked)="leftOpen.set(true)">Open left drawer</ui-button>

<ui-drawer [(open)]="leftOpen" side="left">
  <p>Left-anchored panel, no header/footer templates.</p>
</ui-drawer>`;

  protected readonly leftTs = `import { Component, signal } from '@angular/core';
import { Button } from './ui/button/button';
import { Drawer } from './ui/drawer/drawer';

@Component({
  selector: 'app-left-drawer',
  imports: [Drawer, Button],
  templateUrl: './left-drawer.html',
})
export class LeftDrawer {
  leftOpen = signal(false);
}`;

  protected readonly noBackdropHtml = `<ui-button variant="tertiary" (clicked)="noBackdropOpen.set(true)">Open</ui-button>

<ui-drawer [(open)]="noBackdropOpen" [backdrop]="false" [showCloseButton]="false">
  <p>Press Escape or click outside via your own trigger to close.</p>
</ui-drawer>`;

  protected readonly noBackdropTs = `import { Component, signal } from '@angular/core';
import { Button } from './ui/button/button';
import { Drawer } from './ui/drawer/drawer';

@Component({
  selector: 'app-borderless-drawer',
  imports: [Drawer, Button],
  templateUrl: './borderless-drawer.html',
})
export class BorderlessDrawer {
  noBackdropOpen = signal(false);
}`;
}
