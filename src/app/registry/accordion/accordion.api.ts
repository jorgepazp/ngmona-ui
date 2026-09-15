// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const accordionApi: ComponentApiDoc = {
  name: "Accordion",
  description: "Vertically stacked set of collapsible sections. Wrap `ui-accordion-item` children inside `ui-accordion`, each identified by its own `value`. Bind `[(expandedValues)]` to control which item(s) are open, or leave it uncontrolled (all closed by default). `multiple` allows more than one section open at once. Arrow Up/Down, Home and End move focus between section headers.",
  props: [
    {
      name: "expandedValues",
      kind: "model",
      required: false,
      type: "string[]",
      defaultValue: "[]",
      description: "Value(s) of the currently expanded item(s). Two-way bindable via `[(expandedValues)]`; defaults to none open.",
    },
    {
      name: "multiple",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Allow more than one item open at a time.",
    },
    {
      name: "collapsible",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "true",
      description: "In single-open mode, whether clicking the open item's header closes it again.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the root element.",
    },
  ],
};
