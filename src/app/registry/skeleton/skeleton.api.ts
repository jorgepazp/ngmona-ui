// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const skeletonApi: ComponentApiDoc = {
  name: "Skeleton",
  description: "Pulsing placeholder for content that hasn't loaded yet. Purely decorative — `aria-hidden`.",
  props: [
    {
      name: "width",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "'100%'",
      description: "CSS width of the placeholder block (any valid CSS length, e.g. `'40px'`, `'60%'`).",
    },
    {
      name: "height",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "'1rem'",
      description: "CSS height of the placeholder block.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes, e.g. `'rounded-full'` for an avatar-shaped placeholder.",
    },
  ],
};
