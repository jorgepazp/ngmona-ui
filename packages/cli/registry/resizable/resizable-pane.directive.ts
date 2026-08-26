import { Directive, computed, input, signal } from '@angular/core';

/**
 * Marks a direct child of `<ui-resizable>` as a resizable pane:
 * `<div uiResizablePane [defaultSize]="30" [minSize]="15">...</div>`.
 *
 * `Resizable` reads `defaultSize`/`minSize`/`maxSize` once (via `contentChildren`) to lay out the
 * group, then writes `size` directly as the user drags or keys the separators — the host's
 * `flex-basis` tracks it live. A plain attribute directive is enough here (no component/template
 * of its own needed) since the host element already renders its own projected content.
 */
@Directive({
  selector: '[uiResizablePane]',
  host: {
    '[style.flex]': 'flexStyle()',
    '[style.overflow]': '"auto"',
    '[style.minWidth]': '"0px"',
    '[style.minHeight]': '"0px"',
  },
})
export class ResizablePaneDirective {
  /** Initial size, as a percentage of the group. Panes that omit it share the remaining space equally. */
  readonly defaultSize = input<number | undefined>(undefined);
  /** Minimum size (%) this pane can be resized down to. */
  readonly minSize = input(10);
  /** Maximum size (%) this pane can be resized up to. */
  readonly maxSize = input(90);

  /** Current size (%). `Resizable` is the one writing to this — read-only from the outside. */
  readonly size = signal(0);

  protected readonly flexStyle = computed(() => `0 0 ${this.size()}%`);
}
