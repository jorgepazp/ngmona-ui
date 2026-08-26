import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Skeleton } from '../../../registry/skeleton/skeleton';
import { skeletonApi } from '../../../registry/skeleton/skeleton.api';

@Component({
  selector: 'docs-skeleton',
  imports: [Skeleton, ApiTable],
  templateUrl: './skeleton-docs.html',
})
export default class SkeletonDocs {
  protected readonly api = skeletonApi;
}
