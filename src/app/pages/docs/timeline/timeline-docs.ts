import { Component } from '@angular/core';
import { Timeline } from '../../../registry/timeline/timeline';
import { timelineApi } from '../../../registry/timeline/timeline.api';
import { TimelineItem } from '../../../registry/timeline/timeline-item/timeline-item';
import { timelineItemApi } from '../../../registry/timeline/timeline-item/timeline-item.api';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';

@Component({
  selector: 'docs-timeline',
  imports: [Timeline, TimelineItem, UiTemplateDirective, ApiTable, CodeTabs],
  templateUrl: './timeline-docs.html',
})
export default class TimelineDocs {
  protected readonly api = timelineApi;
  protected readonly timelineItemApi = timelineItemApi;

  protected readonly basicHtml = `<ui-timeline>
  <ui-timeline-item title="Order placed" content="Aug 10, 2026, 09:14"></ui-timeline-item>
  <ui-timeline-item title="Payment confirmed" content="Aug 10, 2026, 09:15" [activeMarker]="true"></ui-timeline-item>
  <ui-timeline-item title="Shipped" content="Awaiting carrier pickup"></ui-timeline-item>
  <ui-timeline-item title="Delivered" content="Estimated Aug 14, 2026"></ui-timeline-item>
</ui-timeline>`;

  protected readonly basicTs = `import { Component } from '@angular/core';
import { Timeline } from './ui/timeline/timeline';
import { TimelineItem } from './ui/timeline/timeline-item/timeline-item';

@Component({
  selector: 'app-order-timeline',
  imports: [Timeline, TimelineItem],
  templateUrl: './order-timeline.html',
})
export class OrderTimeline {}`;

  protected readonly customHtml = `<ui-timeline>
  <ui-timeline-item>
    <ng-template uiTemplate="marker">
      <span class="w-4 h-4 rounded-full bg-success-500"></span>
    </ng-template>
    <ng-template uiTemplate="title">Refund approved</ng-template>
    <ng-template uiTemplate="content">
      <span class="text-success-600 font-semibold">$14.990</span> credited back to the original method.
    </ng-template>
  </ui-timeline-item>
  <ui-timeline-item title="Case closed" content="No further action needed."></ui-timeline-item>
</ui-timeline>`;

  protected readonly customTs = `import { Component } from '@angular/core';
import { Timeline } from './ui/timeline/timeline';
import { TimelineItem } from './ui/timeline/timeline-item/timeline-item';
import { UiTemplateDirective } from './ui/shared/ui-template.directive';

@Component({
  selector: 'app-refund-timeline',
  imports: [Timeline, TimelineItem, UiTemplateDirective],
  templateUrl: './refund-timeline.html',
})
export class RefundTimeline {}`;
}
