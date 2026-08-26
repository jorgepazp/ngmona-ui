import { Component } from '@angular/core';
import { Timeline } from '../../../registry/timeline/timeline';
import { timelineApi } from '../../../registry/timeline/timeline.api';
import { TimelineItem } from '../../../registry/timeline/timeline-item/timeline-item';
import { timelineItemApi } from '../../../registry/timeline/timeline-item/timeline-item.api';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';
import { ApiTable } from '../../../docs-ui/api-table/api-table';

@Component({
  selector: 'docs-timeline',
  imports: [Timeline, TimelineItem, UiTemplateDirective, ApiTable],
  templateUrl: './timeline-docs.html',
})
export default class TimelineDocs {
  protected readonly api = timelineApi;
  protected readonly timelineItemApi = timelineItemApi;
}
