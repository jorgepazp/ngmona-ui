// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const spinnerApi: ComponentApiDoc = {
  name: "Spinner",
  description: "Indeterminate loading spinner (animated arc), for cases that need a standalone spinner rather than `ui-button`'s built-in `[loading]` state. Both source copies (FTD/uiSDP; this component didn't exist in base) were identical, down to a `TODO: quitar HEX del stroke a clases tailwind` comment — i.e. the original authors already flagged that hardcoding the stroke color as a hex string (`#D5006C`, which is just `--color-primary-300`) instead of a Tailwind class was wrong. Fixed here: the SVG now strokes with `currentColor` and color is set via a `text-*` class (`classNames`, defaults to `text-primary-500`), so it reskins the same way every other component in this library does. Accessibility: the original had none. Added `role=\"status\"` plus an `ariaLabel` (defaults to \"Loading\") so screen readers announce the loading state instead of silently seeing nothing.",
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
