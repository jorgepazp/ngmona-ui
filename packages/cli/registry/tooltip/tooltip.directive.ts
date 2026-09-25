import {
  ComponentRef,
  Directive,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Tooltip, TooltipPosition } from './tooltip';
import { UI_LABEL_SOURCE, UiLabelSource } from '../shared/label-source';

let nextTooltipId = 0;

/**
 * Shows a tooltip panel near the host element on hover, focus, or touch-and-hold. Set the
 * tooltip text directly on the directive: `[uiTooltip]="'Some text'"`.
 *
 * Automatically flips to the opposite side of `position` when the requested side doesn't fit in
 * the viewport. Use `showDelay` and `hideDelay` to delay showing or hiding, and `forceVisible` to
 * control visibility programmatically instead of relying on hover, focus or touch.
 */
@Directive({
  selector: '[uiTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'scheduleHide()',
    '(focus)': 'show()',
    '(blur)': 'scheduleHide()',
    '(touchstart)': 'onTouchStart($event)',
    '(touchend)': 'onTouchEnd()',
    '[attr.aria-describedby]': 'ariaDescribedBy()',
  },
  // Lets an icon-only `uiButton` on the same element use the tooltip text as its accessible name.
  providers: [{ provide: UI_LABEL_SOURCE, useExisting: TooltipDirective }],
})
export class TooltipDirective implements OnDestroy, UiLabelSource {
  /** Plain-text tooltip content; ignored when `template` is provided. */
  readonly uiTooltip = input('');
  /** Optional bold heading shown above the body content. */
  readonly heading = input('');
  /** Custom body content, rendered instead of `uiTooltip` when set. */
  readonly template = input<TemplateRef<unknown> | undefined>(undefined);
  /** Side of the host element the tooltip is placed on. */
  readonly position = input<TooltipPosition>('right');
  /** Delay in ms before the tooltip appears after a show-triggering event. */
  readonly showDelay = input(0);
  /** Delay in ms before the tooltip disappears after a hide-triggering event. */
  readonly hideDelay = input(0);
  /** Max width of the tooltip panel in pixels. */
  readonly width = input(231);
  /** Overrides hover/focus/touch handling to show or hide the tooltip programmatically. */
  readonly forceVisible = input<boolean | undefined>(undefined, { alias: 'uiTooltipVisible' });

  private static readonly VIEWPORT_MARGIN = 8;
  private static readonly OPPOSITE_POSITION: Record<TooltipPosition, TooltipPosition> = {
    above: 'below',
    below: 'above',
    left: 'right',
    right: 'left',
  };

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private componentRef: ComponentRef<Tooltip> | null = null;
  private showTimeout?: ReturnType<typeof setTimeout>;
  private hideTimeout?: ReturnType<typeof setTimeout>;
  private touchTimeout?: ReturnType<typeof setTimeout>;

  protected readonly tooltipId = `ui-tooltip-${nextTooltipId++}`;
  private readonly visible = signal(false);
  /** The tooltip's text, for hosts that use it as their accessible name. */
  readonly label = computed(() => this.uiTooltip() || this.heading());
  /** Set by the host when it uses `label` as its name; the tooltip then skips aria-describedby, which would repeat it. */
  readonly usedAsLabel = signal(false);
  protected readonly ariaDescribedBy = computed(() => (this.visible() && !this.usedAsLabel() ? this.tooltipId : null));

  constructor() {
    effect(() => {
      const forced = this.forceVisible();
      if (forced === undefined) return;
      if (forced) {
        this.show();
      } else {
        this.scheduleHide();
      }
    });
  }

  protected show(): void {
    window.clearTimeout(this.hideTimeout);
    if (!this.componentRef) {
      this.componentRef = this.viewContainerRef.createComponent(Tooltip);
    }
    this.applyState();
    this.showTimeout = window.setTimeout(() => {
      this.componentRef?.setInput('visible', true);
      this.visible.set(true);
    }, this.showDelay());
  }

  protected scheduleHide(): void {
    window.clearTimeout(this.showTimeout);
    this.hideTimeout = window.setTimeout(() => this.destroyTooltip(), this.hideDelay());
  }

  protected onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    window.clearTimeout(this.touchTimeout);
    this.touchTimeout = window.setTimeout(() => this.show(), 500);
  }

  protected onTouchEnd(): void {
    window.clearTimeout(this.touchTimeout);
    this.scheduleHide();
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.showTimeout);
    window.clearTimeout(this.hideTimeout);
    window.clearTimeout(this.touchTimeout);
    this.destroyTooltip();
  }

  private applyState(): void {
    const ref = this.componentRef;
    if (!ref) return;

    ref.setInput('text', this.uiTooltip());
    ref.setInput('heading', this.heading());
    ref.setInput('template', this.template());
    ref.setInput('width', this.width());
    ref.setInput('tooltipId', this.tooltipId);

    // Render once at the requested side so the panel has real dimensions to check against the viewport.
    const requested = this.position();
    ref.setInput('position', requested);
    ref.changeDetectorRef.detectChanges();

    const anchorRect = this.elementRef.nativeElement.getBoundingClientRect();
    const panelEl = ref.location.nativeElement.firstElementChild as HTMLElement | null;
    const position = panelEl ? this.resolvePosition(anchorRect, panelEl.getBoundingClientRect(), requested) : requested;

    if (position !== requested) {
      ref.setInput('position', position);
    }

    const { left, top } = this.coordinatesFor(anchorRect, position);
    ref.setInput('left', left);
    ref.setInput('top', top);
  }

  private resolvePosition(anchor: DOMRect, panel: DOMRect, requested: TooltipPosition): TooltipPosition {
    const fits = (position: TooltipPosition): boolean => {
      const margin = TooltipDirective.VIEWPORT_MARGIN;
      switch (position) {
        case 'below':
          return anchor.bottom + panel.height + margin <= window.innerHeight;
        case 'above':
          return anchor.top - panel.height - margin >= 0;
        case 'right':
          return anchor.right + panel.width + margin <= window.innerWidth;
        case 'left':
        default:
          return anchor.left - panel.width - margin >= 0;
      }
    };

    if (fits(requested)) return requested;
    const opposite = TooltipDirective.OPPOSITE_POSITION[requested];
    return fits(opposite) ? opposite : requested;
  }

  private coordinatesFor(anchor: DOMRect, position: TooltipPosition): { left: number; top: number } {
    switch (position) {
      case 'below':
        return { left: Math.round((anchor.right - anchor.left) / 2 + anchor.left), top: Math.round(anchor.bottom) };
      case 'above':
        return { left: Math.round((anchor.right - anchor.left) / 2 + anchor.left), top: Math.round(anchor.top) };
      case 'left':
        return { left: Math.round(anchor.left), top: Math.round(anchor.top + (anchor.bottom - anchor.top) / 2) };
      case 'right':
      default:
        return { left: Math.round(anchor.right), top: Math.round(anchor.top + (anchor.bottom - anchor.top) / 2) };
    }
  }

  private destroyTooltip(): void {
    this.componentRef?.destroy();
    this.componentRef = null;
    this.visible.set(false);
  }
}
