import { Component, ElementRef, computed, contentChildren, effect, input, output, viewChild } from '@angular/core';
import { ResizablePaneDirective } from './resizable-pane.directive';

type ResizableDirection = 'horizontal' | 'vertical';

/**
 * Resizable panel group: any number of panes, each marked with the `uiResizablePane` directive,
 * separated by drag handles.
 *
 * Each handle follows the WAI-ARIA separator pattern and is keyboard operable. Left/Right
 * (horizontal) or Up/Down (vertical) nudge the split by `step`. Home and End send it to the
 * group's start or end, within the neighboring panes' `minSize`/`maxSize`.
 */
@Component({
  selector: 'ui-resizable',
  templateUrl: './resizable.html',
})
export class Resizable {
  /** Axis panes are laid out and resized along. */
  readonly direction = input<ResizableDirection>('horizontal');
  /** Percentage nudge per arrow-key press on a handle. */
  readonly step = input(5);
  /** Extra utility classes on the group container — set an explicit height/width here, since the group doesn't size itself. */
  readonly classNames = input('');
  /** Extra utility classes applied to each drag handle. */
  readonly handleClassNames = input('');

  /** Fires with every pane's current size (%) whenever a handle finishes moving. */
  readonly layoutChange = output<number[]>();

  protected readonly containerRef = viewChild<ElementRef<HTMLDivElement>>('container');
  protected readonly panes = contentChildren(ResizablePaneDirective);

  protected readonly handlePositions = computed(() => {
    const panes = this.panes();
    const positions: number[] = [];
    let cumulative = 0;
    for (let i = 0; i < panes.length - 1; i++) {
      cumulative += panes[i].size();
      positions.push(cumulative);
    }
    return positions;
  });

  private initialized = false;

  constructor() {
    effect(() => {
      const panes = this.panes();
      if (panes.length === 0 || this.initialized) return;

      const declared = panes.map((p) => p.defaultSize() ?? 0);
      const declaredSum = declared.reduce((sum, v) => sum + v, 0);
      if (declaredSum > 0) {
        const scale = 100 / declaredSum;
        panes.forEach((p, i) => p.size.set(declared[i] * scale));
      } else {
        const equal = 100 / panes.length;
        panes.forEach((p) => p.size.set(equal));
      }
      this.initialized = true;
    });
  }

  protected round(value: number): number {
    return Math.round(value);
  }

  protected startDrag(event: PointerEvent, index: number): void {
    if (event.button !== 0) return;
    const panes = this.panes();
    const before = panes[index];
    const after = panes[index + 1];
    const container = this.containerRef()?.nativeElement;
    if (!before || !after || !container) return;

    event.preventDefault();
    const rect = container.getBoundingClientRect();
    const total = this.direction() === 'horizontal' ? rect.width : rect.height;
    const startBefore = before.size();
    const startAfter = after.size();
    const startPos = this.direction() === 'horizontal' ? event.clientX : event.clientY;

    const onMove = (moveEvent: PointerEvent) => {
      const pos = this.direction() === 'horizontal' ? moveEvent.clientX : moveEvent.clientY;
      const deltaPercent = total > 0 ? ((pos - startPos) / total) * 100 : 0;
      this.applyDelta(before, after, startBefore, startAfter, deltaPercent);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      this.layoutChange.emit(this.panes().map((p) => p.size()));
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  protected onHandleKeydown(event: KeyboardEvent, index: number): void {
    const panes = this.panes();
    const before = panes[index];
    const after = panes[index + 1];
    if (!before || !after) return;

    const horizontal = this.direction() === 'horizontal';
    const increaseKey = horizontal ? 'ArrowRight' : 'ArrowDown';
    const decreaseKey = horizontal ? 'ArrowLeft' : 'ArrowUp';

    let delta: number;
    if (event.key === increaseKey) delta = this.step();
    else if (event.key === decreaseKey) delta = -this.step();
    else if (event.key === 'Home') delta = -100;
    else if (event.key === 'End') delta = 100;
    else return;

    event.preventDefault();
    this.applyDelta(before, after, before.size(), after.size(), delta);
    this.layoutChange.emit(this.panes().map((p) => p.size()));
  }

  /** Resizes `before`/`after` from their starting sizes by `deltaPercent`, conserving their combined total and clamping both to their own min/max. */
  private applyDelta(
    before: ResizablePaneDirective,
    after: ResizablePaneDirective,
    startBefore: number,
    startAfter: number,
    deltaPercent: number,
  ): void {
    const total = startBefore + startAfter;
    const minBefore = before.minSize();
    const maxBefore = before.maxSize();
    const minAfter = after.minSize();
    const maxAfter = after.maxSize();

    const lowerBound = Math.max(minBefore, total - maxAfter);
    const upperBound = Math.min(maxBefore, total - minAfter);

    let newBefore = startBefore + deltaPercent;
    newBefore =
      upperBound >= lowerBound
        ? Math.min(Math.max(newBefore, lowerBound), upperBound)
        : Math.min(Math.max(newBefore, minBefore), maxBefore);

    const newAfter = total - newBefore;
    before.size.set(Math.max(0, newBefore));
    after.size.set(Math.max(0, newAfter));
  }
}
