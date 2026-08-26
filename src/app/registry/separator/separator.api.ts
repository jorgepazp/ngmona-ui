// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const separatorApi: ComponentApiDoc = {
  name: "Separator",
  description: "Thin dividing line. Most separators in a layout are purely presentational (spacing between unrelated blocks), so `decorative` defaults to `true` and the line is `aria-hidden` — assistive tech skips straight over it, same as it would a plain visual rule. Set `decorative` to `false` only when the separator genuinely marks a semantic break between two sections of content; that flips it to `role=\"separator\"` with `aria-orientation` so it's announced.",
  props: [
    {
      name: "orientation",
      kind: "input",
      required: false,
      type: "SeparatorOrientation",
      defaultValue: "'horizontal'",
      description: "Line direction. `'vertical'` requires the parent to give it an explicit height (e.g. `flex items-stretch`).",
    },
    {
      name: "decorative",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "true",
      description: "Whether the separator is purely visual (`aria-hidden`) vs. a semantic `role=\"separator\"` — see class doc.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended after the base line styles.",
    },
  ],
};
