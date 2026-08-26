import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Button } from '../../../registry/button/button';
import { Popover } from '../../../registry/popover/popover';
import { popoverApi } from '../../../registry/popover/popover.api';

@Component({
  selector: 'docs-popover',
  imports: [Popover, Button, ApiTable],
  templateUrl: './popover-docs.html',
})
export default class PopoverDocs {
  protected readonly open = signal(false);
  protected readonly api = popoverApi;
}
