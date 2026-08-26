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

let nextTooltipId = 0;

/**
 * `[uiTooltip]="'Some text'"` — shows a `Tooltip` panel near the host element on hover, focus,
 * or touch-and-hold.
 *
 * Modernized from the original `ComponentFactoryResolver`-based implementation (deprecated since
 * Angular 13, and the whole reason this migration was called out): `ViewContainerRef.createComponent`
 * takes the component type directly now, no factory resolver needed. The original also manually
 * attached the view to `ApplicationRef` and appended its root node to `document.body` to escape
 * ancestor clipping — since the panel is `position: fixed`, it's positioned relative to the
 * viewport regardless of where it sits in the DOM, so that manual `attachView`/`appendChild`/
 * `detachView` dance is dropped; `ViewContainerRef.createComponent` alone is enough, and
 * `componentRef.destroy()` cleans it up correctly.
 *
 * Also fixes a real accessibility gap: the original only listened for `mouseenter`/`mouseleave`
 * and touch, so keyboard-only users could never trigger the tooltip. `focus`/`blur` handling is
 * added here, plus `aria-describedby` on the host element pointing at the tooltip's `id` while
 * it's visible, so screen readers announce it.
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
})
export class TooltipDirective implements OnDestroy {
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

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private componentRef: ComponentRef<Tooltip> | null = null;
  private showTimeout?: ReturnType<typeof setTimeout>;
  private hideTimeout?: ReturnType<typeof setTimeout>;
  private touchTimeout?: ReturnType<typeof setTimeout>;

  protected readonly tooltipId = `ui-tooltip-${nextTooltipId++}`;
  private readonly visible = signal(false);
  protected readonly ariaDescribedBy = computed(() => (this.visible() ? this.tooltipId : null));

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
    if (!this.componentRef) return;

    const { left, right, top, bottom } = this.elementRef.nativeElement.getBoundingClientRect();
    const position = this.position();
    let x = 0;
    let y = 0;
    switch (position) {
      case 'below':
        x = Math.round((right - left) / 2 + left);
        y = Math.round(bottom);
        break;
      case 'above':
        x = Math.round((right - left) / 2 + left);
        y = Math.round(top);
        break;
      case 'left':
        x = Math.round(left);
        y = Math.round(top + (bottom - top) / 2);
        break;
      case 'right':
      default:
        x = Math.round(right);
        y = Math.round(top + (bottom - top) / 2);
        break;
    }

    this.componentRef.setInput('text', this.uiTooltip());
    this.componentRef.setInput('heading', this.heading());
    this.componentRef.setInput('template', this.template());
    this.componentRef.setInput('position', position);
    this.componentRef.setInput('width', this.width());
    this.componentRef.setInput('left', x);
    this.componentRef.setInput('top', y);
    this.componentRef.setInput('tooltipId', this.tooltipId);
  }

  private destroyTooltip(): void {
    this.componentRef?.destroy();
    this.componentRef = null;
    this.visible.set(false);
  }
}
