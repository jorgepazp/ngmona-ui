// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../../docs-ui/api-table/api-table';

export const tabPanelApi: ComponentApiDoc = {
  name: "TabPanel",
  description: "Single panel of a `ui-tabs`. Must be a direct child of `<ui-tabs>` — the parent reads `label`/ `icon`/`disabled`/a `label` template off this component to draw its own tab strip button (same injected-parent pattern as `AccordionItem`), while this component renders only its own `role=\"tabpanel\"` region, and only while active — inactive panels aren't mounted at all.",
  props: [
    {
      name: "value",
      kind: "input",
      required: true,
      type: "string",
      defaultValue: "",
      description: "Unique identifier for this panel, used as the value of the parent `ui-tabs`'s `[(active)]`.",
    },
    {
      name: "label",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Static label text shown on the tab strip button; ignored when a `uiTemplate=\"label\"` is projected.",
    },
    {
      name: "disabled",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Excludes this tab from selection and keyboard navigation, and shows it in a disabled visual state.",
    },
    {
      name: "icon",
      kind: "input",
      required: false,
      type: "LucideIconInput | undefined",
      defaultValue: "undefined",
      description: "Icon shown next to the label on the tab strip button.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the panel's `role=\"tabpanel\"` element.",
    },
  ],
};
