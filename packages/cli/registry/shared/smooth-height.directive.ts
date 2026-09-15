import { Directive, ElementRef, OnDestroy, inject, input } from '@angular/core';
import { animateHeightTo } from './animations';

/**
 * Animates height changes on an element whose content resizes in place, e.g.
 * `<div [smoothHeight]="items.length">`.
 *
 * Observes the host's rendered height and plays a transition from the previous height to the new
 * one whenever it changes.
 */
@Directive({
  selector: '[smoothHeight]',
  host: {
    '[style.display]': '"block"',
    '[style.overflow-y]': '"hidden"',
  },
})
export class SmoothHeightDirective implements OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);

  /** Kept for API compatibility with `[smoothHeight]="..."`; the value itself isn't read. */
  readonly smoothHeight = input<unknown>();

  private readonly resizeObserver = new ResizeObserver(() => this.onResize());
  private lastHeight: number | null = null;
  private animating = false;

  constructor() {
    this.resizeObserver.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  private onResize(): void {
    if (this.animating) return;
    const host = this.element.nativeElement;
    const nextHeight = host.scrollHeight;
    if (this.lastHeight !== null && this.lastHeight !== nextHeight) {
      this.animating = true;
      animateHeightTo(host, this.lastHeight, () => {
        this.animating = false;
      });
    }
    this.lastHeight = nextHeight;
  }
}
