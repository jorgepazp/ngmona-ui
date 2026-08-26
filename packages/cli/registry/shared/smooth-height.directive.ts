import { Directive, ElementRef, OnDestroy, inject, input } from '@angular/core';
import { animateHeightTo } from './animations';

/**
 * Animates height changes on an element whose content resizes in place, e.g.
 * `<div [smoothHeight]="items.length">`. `animate.enter`/`animate.leave` (the native replacement
 * for the old `collapsable` trigger) only fire when the *element itself* is inserted/removed, so
 * they can't handle this case — the element stays mounted the whole time, only its content size
 * changes. Instead this observes the host's real rendered height via `ResizeObserver` and, on any
 * change, plays a Web Animations API transition from the previous height to the new one.
 *
 * The original directive tried to approximate this by re-triggering the `collapsable` trigger on
 * every input change and threading a `startHeight` animation param through it — but `collapsable`
 * never referenced that param anywhere, so it was silently ignored, and the "before" height was
 * read synchronously inside an `effect()`, which runs after change detection has already applied
 * the new DOM state, capturing the *new* height under the `startHeight` name. `ResizeObserver`
 * sidesteps both bugs: its callback fires only once the browser has actually laid out the new
 * size, so the height compared against is always correct regardless of effect/CD ordering.
 *
 * The `smoothHeight` input is kept only so the attribute selector `[smoothHeight]` still has
 * something to bind to per the original API — height changes are now detected automatically from
 * whatever causes them, not from this input's identity changing.
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
