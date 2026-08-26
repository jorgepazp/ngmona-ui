// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const accordionApi: ComponentApiDoc = {
  name: "Accordion",
  description: "Wraps `ui-accordion-item` children (like `Timeline`/`TimelineItem`). Coordination between the parent and its items — which value(s) are expanded, single-vs-multiple-open, and Up/Down/Home/ End navigation between headers — is done by each `AccordionItem` injecting this component directly (`inject(Accordion)`), the same way `Checkbox`/`Radio` inject `NG_VALUE_ACCESSOR` machinery, just without the forms indirection since there's no `ControlValueAccessor` need here. `expandedValues` is a `model<string[]>` so the whole open/closed set can be bound with `[(expandedValues)]` for a fully controlled accordion, or left uncontrolled (defaults to `[]`).",
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
