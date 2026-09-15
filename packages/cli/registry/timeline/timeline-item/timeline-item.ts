import { Component, computed, contentChildren, input, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideCircle } from '@lucide/angular';
import { UiTemplateDirective } from '../../shared/ui-template.directive';

/**
 * Single entry in a `ui-timeline`. Must be a direct child of `ui-timeline`.
 *
 * Supports plain `title`/`content` string inputs, or `marker`, `title` and `content` templates
 * via `uiTemplate` for custom content. Set `activeMarker` to highlight the marker as the current
 * entry.
 */
@Component({
  selector: 'ui-timeline-item',
  imports: [NgTemplateOutlet, LucideCircle],
  templateUrl: './timeline-item.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class TimelineItem {
  /** Static title text; ignored when a `uiTemplate="title"` is projected. */
  readonly title = input('');
  /** Static body text; ignored when a `uiTemplate="content"` is projected. */
  readonly content = input('');
  /** Highlights the marker as the active/current entry (a small filled dot instead of an outline). */
  readonly activeMarker = input(false);

  /**
   * Whether this is the last item in the group. `Timeline` is the one writing to this — read-only
   * from the outside. Can't rely on CSS `:last-child` here since this component's `display:
   * contents` host keeps each `<li>` under its own wrapper element, so every item is its parent's
   * only (and thus last) child.
   */
  readonly isLast = signal(false);

  protected readonly circleIcon = LucideCircle;

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly markerTemplate = computed(() => this.templates().find((t) => t.name() === 'marker')?.template);
  protected readonly titleTemplate = computed(() => this.templates().find((t) => t.name() === 'title')?.template);
  protected readonly contentTemplate = computed(() => this.templates().find((t) => t.name() === 'content')?.template);
}
