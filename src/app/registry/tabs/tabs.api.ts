// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const tabsApi: ComponentApiDoc = {
  name: "Tabs",
  description: "Full WAI-ARIA tabs pattern: `ui-tabs` draws the `role=\"tablist\"` strip itself, reading label/icon/disabled metadata off each projected `ui-tab-panel` child (via `contentChildren`, same injected-parent coordination as `Accordion`/`AccordionItem`); each `TabPanel` renders its own `role=\"tabpanel\"` region only while active, so the panel content stays physically anchored where the caller wrote it in the template instead of being re-parented. Roving `tabindex` (selected tab is `0`, the rest `-1`) plus Left/Right (or Up/Down when `orientation=\"vertical\"`) and Home/End keyboard navigation between tabs — a hard requirement for a real tabs widget, not optional polish. `active` is a `model<string>`, so it can be left uncontrolled (the first non-disabled panel is auto-selected) or bound with `[(active)]` for a fully controlled tab set.",
  props: [
    {
      name: "active",
      kind: "model",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Value of the currently selected tab. Two-way bindable via `[(active)]`; leave unset for auto-selection.",
    },
    {
      name: "orientation",
      kind: "input",
      required: false,
      type: "TabsOrientation",
      defaultValue: "'horizontal'",
      description: "Layout direction of the tab strip and its keyboard navigation axis (Left/Right vs Up/Down).",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the host element.",
    },
    {
      name: "tabListClassNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the `role=\"tablist\"` strip element.",
    },
  ],
};
