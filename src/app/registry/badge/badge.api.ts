// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const badgeApi: ComponentApiDoc = {
  name: "Badge",
  description: "Small status/label pill. `primary` and `neutral` render solid (they have no near-white tint in the palette to pair with dark text); the status variants (`success`/`warning`/`danger`/`info`) use the dedicated `--color-surface-*-light` / `--color-text-*` token pairs, which is exactly what that semantic pair exists for — a legible light-bg/dark-text combination without hand -computing opacity tricks. Badges are text-first by convention (never color alone) so no extra ARIA is needed for the common case. When a badge stands in for a count/status on another element with no visible text of its own, pass `ariaLabel` to give it an accessible name.",
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
