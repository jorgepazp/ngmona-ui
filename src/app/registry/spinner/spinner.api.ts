// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const spinnerApi: ComponentApiDoc = {
  name: "Spinner",
  description: "Indeterminate loading spinner (animated arc), for standalone use rather than `uiButton`'s built-in `loading` state. The stroke uses `currentColor`, controlled via a text color class in `classNames`. Renders with `role=\"status\"` and `ariaLabel` so screen readers announce the loading state.",
  props: [
    {
      name: "size",
      kind: "input",
      required: false,
      type: "number",
      defaultValue: "52",
      description: "Width/height of the SVG in pixels.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "'text-primary-500'",
      description: "Text color class controlling the stroke via `currentColor` — swap to reskin the spinner.",
    },
    {
      name: "ariaLabel",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "'Loading'",
      description: "Accessible name announced by screen readers via `role=\"status\"`.",
    },
  ],
};
