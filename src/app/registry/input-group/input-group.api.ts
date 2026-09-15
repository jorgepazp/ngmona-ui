// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const inputGroupApi: ComponentApiDoc = {
  name: "InputGroup",
  description: "Layout primitive that visually joins prefix and suffix addons (icons, text, buttons) with a projected input into one bordered unit, for example a currency symbol plus an amount field, or a search box with a \"Go\" button. Project addons with the `prefix` and `suffix` attributes on either side of the input. The group's border reacts to focus of anything inside it; remove the border and outline from the projected input so only the group's border shows.",
  props: [
    {
      name: "disabled",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Dims the group and disables pointer interaction with everything projected inside it.",
    },
    {
      name: "state",
      kind: "input",
      required: false,
      type: "InputGroupState",
      defaultValue: "null",
      description: "Validation state — tints the border success/warning/error; `null` for the neutral default.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the wrapper.",
    },
  ],
};
