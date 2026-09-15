import { Component, ElementRef, computed, contentChildren, input, model, viewChildren } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideDynamicIcon } from '@lucide/angular';
import { TabPanel } from './tab-panel/tab-panel';

let nextInstanceId = 0;

export type TabsOrientation = 'horizontal' | 'vertical';

/**
 * Tab set following the WAI-ARIA tabs pattern. Each projected `ui-tab-panel` child provides its
 * own label, icon and disabled state, and renders its content only while active.
 *
 * Navigate between tabs with Left/Right (or Up/Down when `orientation="vertical"`), Home and End.
 * Leave `active` unset to auto-select the first non-disabled tab, or bind `[(active)]` for a
 * fully controlled tab set.
 */
@Component({
  selector: 'ui-tabs',
  imports: [NgTemplateOutlet, LucideDynamicIcon],
  templateUrl: './tabs.html',
})
export class Tabs {
  /** Value of the currently selected tab. Two-way bindable via `[(active)]`; leave unset for auto-selection. */
  readonly active = model('');
  /** Layout direction of the tab strip and its keyboard navigation axis (Left/Right vs Up/Down). */
  readonly orientation = input<TabsOrientation>('horizontal');
  /** Extra utility classes appended to the host element. */
  readonly classNames = input('');
  /** Extra utility classes appended to the `role="tablist"` strip element. */
  readonly tabListClassNames = input('');

  private readonly instanceId = nextInstanceId++;
  protected readonly panels = contentChildren(TabPanel);
  private readonly tabRefs = viewChildren<ElementRef<HTMLButtonElement>>('tabRef');

  /** Falls back to the first non-disabled panel when nothing is explicitly active yet. */
  protected readonly resolvedActive = computed(() => {
    const explicit = this.active();
    if (explicit) return explicit;
    const panels = this.panels();
    const first = panels.find((p) => !p.disabled()) ?? panels[0];
    return first?.value() ?? '';
  });

  tabId(value: string): string {
    return `ui-tab-${this.instanceId}-${value}`;
  }

  panelId(value: string): string {
    return `ui-tabpanel-${this.instanceId}-${value}`;
  }

  isActive(value: string): boolean {
    return this.resolvedActive() === value;
  }

  protected tabButtonClass(panel: TabPanel): string {
    const base =
      'flex items-center gap-1 !px-3 !py-2 text-label-md cursor-pointer border-none bg-transparent transition-colors disabled:cursor-not-allowed disabled:text-text-disabled';
    const state = this.isActive(panel.value())
      ? 'text-text-active border-b-2 !border-primary-500'
      : 'text-text-subdued hover:text-text-primary border-b-2 border-transparent';
    return `${base} ${state}`;
  }

  protected select(panel: TabPanel): void {
    if (panel.disabled()) return;
    this.active.set(panel.value());
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const panels = this.panels();
    if (!panels.length) return;

    const horizontal = this.orientation() === 'horizontal';
    const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';

    let nextIndex: number | null = null;
    switch (event.key) {
      case nextKey:
        nextIndex = this.findNextEnabled(panels, index, 1);
        break;
      case prevKey:
        nextIndex = this.findNextEnabled(panels, index, -1);
        break;
      case 'Home':
        nextIndex = this.findNextEnabled(panels, -1, 1);
        break;
      case 'End':
        nextIndex = this.findNextEnabled(panels, panels.length, -1);
        break;
      default:
        return;
    }
    if (nextIndex === null) return;

    event.preventDefault();
    const panel = panels[nextIndex];
    this.active.set(panel.value());
    this.tabRefs()[nextIndex]?.nativeElement.focus();
  }

  private findNextEnabled(panels: readonly TabPanel[], from: number, dir: 1 | -1): number | null {
    const len = panels.length;
    for (let step = 1; step <= len; step++) {
      const idx = (((from + dir * step) % len) + len) % len;
      if (!panels[idx].disabled()) return idx;
    }
    return null;
  }
}
