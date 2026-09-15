// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const cardApi: ComponentApiDoc = {
  name: "Card",
  description: "Plain bordered container with an optional shadow. Use `shadow` to control when the shadow appears: on hover, always, or never.",
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
