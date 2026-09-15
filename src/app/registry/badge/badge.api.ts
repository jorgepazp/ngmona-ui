// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const badgeApi: ComponentApiDoc = {
  name: "Badge",
  description: "Small label used to show a status, category or count. `primary` and `neutral` render with a solid background. The status variants (`success`, `warning`, `danger`, `info`) render with a light background and matching text color. When a badge conveys meaning without its own visible text, such as a bare status dot, pass `ariaLabel` to give it an accessible name.",
  props: [
    {
      name: "variant",
      kind: "input",
      required: false,
      type: "BadgeVariant",
      defaultValue: "'neutral'",
      description: "Color variant.",
    },
    {
      name: "size",
      kind: "input",
      required: false,
      type: "BadgeSize",
      defaultValue: "'md'",
      description: "Overall size.",
    },
    {
      name: "icon",
      kind: "input",
      required: false,
      type: "LucideIconInput | undefined",
      defaultValue: "undefined",
      description: "Optional leading icon.",
    },
    {
      name: "pill",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "true",
      description: "Fully rounded pill shape when `true` (default); a smaller corner radius when `false`.",
    },
    {
      name: "ariaLabel",
      kind: "input",
      required: false,
      type: "string | undefined",
      defaultValue: "undefined",
      description: "Accessible name for badges that convey meaning without their own visible text (e.g. a bare status dot).",
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
