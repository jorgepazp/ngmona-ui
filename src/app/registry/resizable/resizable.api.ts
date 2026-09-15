// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const resizableApi: ComponentApiDoc = {
  name: "Resizable",
  description: "Resizable panel group: any number of panes, each marked with the `uiResizablePane` directive, separated by drag handles. Each handle follows the WAI-ARIA separator pattern and is keyboard operable. Left/Right (horizontal) or Up/Down (vertical) nudge the split by `step`. Home and End send it to the group's start or end, within the neighboring panes' `minSize`/`maxSize`.",
  props: [
    {
      name: "direction",
      kind: "input",
      required: false,
      type: "ResizableDirection",
      defaultValue: "'horizontal'",
      description: "Axis panes are laid out and resized along.",
    },
    {
      name: "step",
      kind: "input",
      required: false,
      type: "number",
      defaultValue: "5",
      description: "Percentage nudge per arrow-key press on a handle.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes on the group container — set an explicit height/width here, since the group doesn't size itself.",
    },
    {
      name: "handleClassNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes applied to each drag handle.",
    },
    {
      name: "layoutChange",
      kind: "output",
      required: false,
      type: "number[]",
      defaultValue: "",
      description: "Fires with every pane's current size (%) whenever a handle finishes moving.",
    },
  ],
};
