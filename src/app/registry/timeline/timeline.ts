import { Component, input } from '@angular/core';

/**
 * Vertical timeline list. Wraps `ui-timeline-item` children in an `<ol>` with a connecting
 * left border; each item draws its own segment of the vertical line and its marker.
 */
@Component({
  selector: 'ui-timeline',
  templateUrl: './timeline.html',
})
export class Timeline {
  /** Extra utility classes appended to the host `<ol>` element. */
  readonly classNames = input('');
}
