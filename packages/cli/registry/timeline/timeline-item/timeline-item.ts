import { Component, computed, contentChildren, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideCircle } from '@lucide/angular';
import { UiTemplateDirective } from '../../shared/ui-template.directive';

/**
 * Single entry in a `ui-timeline`. Must be a direct child of `<ui-timeline>` — renders as a
 * plain `<li>` (`:host { display: contents }`) so the parent's `<ol>`/`<li>` structure stays real.
 *
 * Supports plain `title`/`content` string inputs, or `<ng-template uiTemplate="marker|title|content">`
 * for custom content (same named-slot pattern as `Checkbox`'s label template).
 *
 * The original required a manually-set `isLast` @Input to hide the connector line past the final
 * item — easy to forget, and silently wrong the moment items are added, removed, or reordered
 * without updating it. Replaced here with Tailwind's `group-last:` variant driven by real DOM
 * position, so it's always correct with no coordination needed from the parent or the consumer.
 * Also fixes a typo'd, nonexistent `bg-color-surface-white` class (should have been
 * `bg-surface-white`, the actual theme token) that silently left that patch transparent.
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

  protected readonly circleIcon = LucideCircle;

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly markerTemplate = computed(() => this.templates().find((t) => t.name() === 'marker')?.template);
  protected readonly titleTemplate = computed(() => this.templates().find((t) => t.name() === 'title')?.template);
  protected readonly contentTemplate = computed(() => this.templates().find((t) => t.name() === 'content')?.template);
}
