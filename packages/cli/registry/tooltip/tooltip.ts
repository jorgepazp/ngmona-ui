import { Component, TemplateRef, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export type TooltipPosition = 'above' | 'below' | 'left' | 'right';

/**
 * Floating tooltip panel used internally by the `uiTooltip` directive, which creates and
 * positions instances of it on demand. Not meant to be used directly in a template; apply
 * `uiTooltip` to an element instead.
 */
@Component({
  selector: 'ui-tooltip',
  imports: [NgTemplateOutlet],
  templateUrl: './tooltip.html',
  host: { style: 'display: contents;' },
})
export class Tooltip {
  /** Plain-text body content; ignored when `template` is provided. */
  readonly text = input('');
  /** Optional bold heading shown above the body content. */
  readonly heading = input('');
  /** Custom body content, rendered instead of `text` when set. */
  readonly template = input<TemplateRef<unknown> | undefined>(undefined);
  /** Side of the anchor element the panel is placed on. */
  readonly position = input<TooltipPosition>('right');
  /** Absolute `left` pixel coordinate the panel is positioned at, set by `TooltipDirective`. */
  readonly left = input(0);
  /** Absolute `top` pixel coordinate the panel is positioned at, set by `TooltipDirective`. */
  readonly top = input(0);
  /** Max width of the panel in pixels. */
  readonly width = input(231);
  /** Shows or hides the panel. */
  readonly visible = input(false);
  /** Id applied to the panel element so a trigger can reference it via `aria-describedby`. */
  readonly tooltipId = input('');

  protected readonly positionClass = computed(() => {
    switch (this.position()) {
      case 'above':
        return '-translate-x-1/2 -translate-y-[calc(100%+8px)] !mb-3';
      case 'below':
        return '-translate-x-1/2 !mt-3';
      case 'left':
        return 'translate-x-[calc(-100%-12px)] -translate-y-1/2';
      case 'right':
      default:
        return '-translate-y-1/2 !ml-4';
    }
  });

  protected readonly caretPositionClass = computed(() => {
    switch (this.position()) {
      case 'above':
        return 'left-[calc(50%-8px)] right-[calc(50%-8px)] -bottom-[5px]';
      case 'below':
        return 'left-[calc(50%-8px)] right-[calc(50%-8px)] -top-[5px]';
      case 'left':
        return '-right-[5px] top-[calc(50%-8px)]';
      case 'right':
      default:
        return '-left-[5px] top-[calc(50%-8px)]';
    }
  });
}
