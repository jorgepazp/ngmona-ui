import { Component } from '@angular/core';
import { LucideHeart, LucideDownload } from '@lucide/angular';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Button } from '../../../registry/button/button';
import { buttonApi } from '../../../registry/button/button.api';

@Component({
  selector: 'docs-button',
  imports: [Button, ApiTable],
  templateUrl: './button-docs.html',
})
export default class ButtonDocs {
  protected readonly heartIcon = LucideHeart;
  protected readonly downloadIcon = LucideDownload;
  protected readonly api = buttonApi;
}
