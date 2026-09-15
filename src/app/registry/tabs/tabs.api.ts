// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const tabsApi: ComponentApiDoc = {
  name: "Tabs",
  description: "Tab set following the WAI-ARIA tabs pattern. Each projected `ui-tab-panel` child provides its own label, icon and disabled state, and renders its content only while active. Navigate between tabs with Left/Right (or Up/Down when `orientation=\"vertical\"`), Home and End. Leave `active` unset to auto-select the first non-disabled tab, or bind `[(active)]` for a fully controlled tab set.",
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
