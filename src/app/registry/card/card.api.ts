// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const cardApi: ComponentApiDoc = {
  name: "Card",
  description: "Plain bordered container with an optional card shadow. Identical across all three source forks, so this is a straight port. Fixed the surface/border classes: the original referenced `bg-color-surface-white` / `border-color-border-neutral`, which aren't real utilities under the new token names (`--color-surface-white`, `--color-border-neutral`) — Tailwind generates `bg-surface-white` / `border-border-neutral` from those, so the intended background/border were silently never applied.",
  props: [
    {
      name: "shadow",
      kind: "input",
      required: false,
      type: "CardShadow",
      defaultValue: "'hover'",
      description: "Controls when the card's drop shadow appears: `'hover'` only on hover, `'always'` on, or `'none'` never.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the card's root element, for one-off layout/spacing overrides.",
    },
  ],
};
