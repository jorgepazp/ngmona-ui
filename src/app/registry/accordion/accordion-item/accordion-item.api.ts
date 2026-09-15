// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../../docs-ui/api-table/api-table';

export const accordionItemApi: ComponentApiDoc = {
  name: "AccordionItem",
  description: "Single entry in a `ui-accordion`. Must be a direct child of `ui-accordion`; its expanded state is read from and driven through the parent. Header buttons stay in the normal tab order; Up/Down/Home/End additionally move focus between them without changing that order.",
  props: [
    {
      name: "value",
      kind: "input",
      required: true,
      type: "string",
      defaultValue: "",
      description: "Unique identifier for this item, matched against the parent `Accordion`'s `expandedValues`.",
    },
    {
      name: "heading",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Header text shown in the trigger button; ignored when a `uiTemplate=\"header\"` is projected.",
    },
    {
      name: "disabled",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Prevents this item's header from being toggled open/closed.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the item's root element.",
    },
  ],
};
