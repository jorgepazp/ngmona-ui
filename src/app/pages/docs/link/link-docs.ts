import { Component } from '@angular/core';
import { LucideArrowRight } from '@lucide/angular';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Link } from '../../../registry/link/link';
import { linkApi } from '../../../registry/link/link.api';

@Component({
  selector: 'docs-link',
  imports: [Link, ApiTable],
  templateUrl: './link-docs.html',
})
export default class LinkDocs {
  protected readonly arrowIcon = LucideArrowRight;
  protected readonly api = linkApi;
}
