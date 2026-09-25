import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Skeleton } from '../../../registry/skeleton/skeleton';
import { skeletonApi } from '../../../registry/skeleton/skeleton.api';

@Component({
  selector: 'docs-skeleton',
  imports: [Skeleton, ApiTable, CodeTabs],
  templateUrl: './skeleton-docs.html',
})
export default class SkeletonDocs {
  protected readonly api = skeletonApi;

  protected readonly basicHtml = `<div class="flex items-center gap-4">
  <ui-skeleton width="40px" height="40px" classNames="rounded-full"></ui-skeleton>
  <div class="flex flex-col gap-3 flex-1">
    <ui-skeleton height="12px" width="60%"></ui-skeleton>
    <ui-skeleton height="12px" width="40%"></ui-skeleton>
  </div>
</div>
<ui-skeleton height="120px"></ui-skeleton>`;

  protected readonly basicTs = `import { Component } from '@angular/core';
import { Skeleton } from './ui/skeleton/skeleton';

@Component({
  selector: 'app-profile-card-skeleton',
  imports: [Skeleton],
  templateUrl: './profile-card-skeleton.html',
})
export class ProfileCardSkeleton {}`;
}
