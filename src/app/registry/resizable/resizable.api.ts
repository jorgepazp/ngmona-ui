// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const resizableApi: ComponentApiDoc = {
  name: "Resizable",
  description: "Resizable panel group: N panes (each marked with the `uiResizablePane` directive, projected as plain content) separated by drag handles. Dragging is plain `pointerdown`/`pointermove`/`pointerup` listeners rather than `@angular/cdk/drag-drop`'s `CdkDrag`. `CdkDrag` is built around free transform-based dragging of a single element; it doesn't map cleanly onto \"redistribute a percentage split between two adjacent flex-basis panes while clamping both to their own min/max\" — plain pointer events end up simpler and more direct for this shape of problem. Each handle follows the WAI-ARIA \"separator\" pattern: `role=\"separator\"`, `aria-orientation`, and `aria-valuenow`/`aria-valuemin`/`aria-valuemax` tracking the boundary's position as a percentage of the group. It's a real focusable, keyboard-operable element — Left/Right (horizontal) or Up/Down (vertical) nudge the split by `step`, Home/End send it to the group's start/end (as far as the neighboring panes' `minSize`/`maxSize` allow).",
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
