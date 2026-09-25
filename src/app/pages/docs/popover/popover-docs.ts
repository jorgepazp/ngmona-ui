import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Button } from '../../../registry/button/button';
import { Popover } from '../../../registry/popover/popover';
import { popoverApi } from '../../../registry/popover/popover.api';

@Component({
  selector: 'docs-popover',
  imports: [Popover, Button, ApiTable, CodeTabs],
  templateUrl: './popover-docs.html',
})
export default class PopoverDocs {
  protected readonly open = signal(false);
  protected readonly api = popoverApi;

  protected readonly basicHtml = `<ui-popover [(open)]="open" [panelClass]="'w-128'">
  <ui-button trigger>Toggle popover</ui-button>
  <div class="flex flex-col gap-2">
    <p class="font-semibold">Popover content</p>
    <p>Any content can go here; it's only rendered while the popover is open.</p>
  </div>
</ui-popover>`;

  protected readonly basicTs = `import { Component, signal } from '@angular/core';
import { Button } from './ui/button/button';
import { Popover } from './ui/popover/popover';

@Component({
  selector: 'app-info-popover',
  imports: [Popover, Button],
  templateUrl: './info-popover.html',
})
export class InfoPopover {
  open = signal(false);
}`;
}
