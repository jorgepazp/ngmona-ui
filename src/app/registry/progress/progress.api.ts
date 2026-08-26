// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const progressApi: ComponentApiDoc = {
  name: "Progress",
  description: "Horizontal progress bar. Omit `value` (or pass `undefined`) for an indeterminate state — a looping bar animation and no `aria-valuenow` (per the ARIA `progressbar` pattern, omitting `aria-valuenow` is how you signal \"progress can't currently be measured\").",
  props: [
    {
      name: "value",
      kind: "input",
      required: false,
      type: "number | undefined",
      defaultValue: "undefined",
      description: "Current progress amount, out of `max`. Omit (or pass `undefined`) for an indeterminate bar — see class doc.",
    },
    {
      name: "max",
      kind: "input",
      required: false,
      type: "number",
      defaultValue: "100",
      description: "Value that represents 100% completion.",
    },
    {
      name: "size",
      kind: "input",
      required: false,
      type: "ProgressSize",
      defaultValue: "'md'",
      description: "Track/fill thickness.",
    },
    {
      name: "variant",
      kind: "input",
      required: false,
      type: "ProgressVariant",
      defaultValue: "'primary'",
      description: "Color of the fill, e.g. to signal a success/warning/danger state.",
    },
    {
      name: "ariaLabel",
      kind: "input",
      required: false,
      type: "string | undefined",
      defaultValue: "undefined",
      description: "Accessible name for the `progressbar` element.",
    },
    {
      name: "valueText",
      kind: "input",
      required: false,
      type: "string | undefined",
      defaultValue: "undefined",
      description: "Overrides the announced value text, e.g. `\"3 of 5 steps\"`, instead of the raw percentage.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the track element.",
    },
  ],
};
