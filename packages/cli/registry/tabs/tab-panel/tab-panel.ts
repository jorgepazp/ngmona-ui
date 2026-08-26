import { Component, computed, contentChildren, inject, input } from '@angular/core';
import type { LucideIconInput } from '@lucide/angular';
import { UiTemplateDirective } from '../../shared/ui-template.directive';
import { Tabs } from '../tabs';

/**
 * Single panel of a `ui-tabs`. Must be a direct child of `<ui-tabs>` — the parent reads `label`/
 * `icon`/`disabled`/a `label` template off this component to draw its own tab strip button (same
 * injected-parent pattern as `AccordionItem`), while this component renders only its own
 * `role="tabpanel"` region, and only while active — inactive panels aren't mounted at all.
 */
@Component({
  selector: 'ui-tab-panel',
  templateUrl: './tab-panel.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class TabPanel {
  private readonly tabs = inject(Tabs);

  /** Unique identifier for this panel, used as the value of the parent `ui-tabs`'s `[(active)]`. */
  readonly value = input.required<string>();
  /** Static label text shown on the tab strip button; ignored when a `uiTemplate="label"` is projected. */
  readonly label = input('');
  /** Excludes this tab from selection and keyboard navigation, and shows it in a disabled visual state. */
  readonly disabled = input(false);
  /** Icon shown next to the label on the tab strip button. */
  readonly icon = input<LucideIconInput | undefined>(undefined);
  /** Extra utility classes appended to the panel's `role="tabpanel"` element. */
  readonly classNames = input('');

  private readonly templates = contentChildren(UiTemplateDirective);
  readonly labelTemplate = computed(() => this.templates().find((t) => t.name() === 'label')?.template);

  protected readonly active = computed(() => this.tabs.isActive(this.value()));
  protected readonly tabId = computed(() => this.tabs.tabId(this.value()));
  protected readonly panelId = computed(() => this.tabs.panelId(this.value()));
}
