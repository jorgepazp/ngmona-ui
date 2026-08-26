import { Component } from '@angular/core';
import { LucideCheck } from '@lucide/angular';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Badge } from '../../../registry/badge/badge';
import { badgeApi } from '../../../registry/badge/badge.api';

@Component({
  selector: 'docs-badge',
  imports: [Badge, ApiTable],
  templateUrl: './badge-docs.html',
})
export default class BadgeDocs {
  protected readonly checkIcon = LucideCheck;
  protected readonly api = badgeApi;
}
