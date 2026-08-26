import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Drawer } from '../../../registry/drawer/drawer';
import { drawerApi } from '../../../registry/drawer/drawer.api';
import { Button } from '../../../registry/button/button';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';

@Component({
  selector: 'docs-drawer',
  imports: [Drawer, Button, UiTemplateDirective, ApiTable],
  templateUrl: './drawer-docs.html',
})
export default class DrawerDocs {
  protected readonly rightOpen = signal(false);
  protected readonly leftOpen = signal(false);
  protected readonly noBackdropOpen = signal(false);
  protected readonly api = drawerApi;
}
