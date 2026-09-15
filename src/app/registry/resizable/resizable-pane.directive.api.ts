// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const resizablePaneDirectiveApi: ComponentApiDoc = {
  name: "ResizablePaneDirective",
  description: "Marks a direct child of `ui-resizable` as a resizable pane, e.g. `<div uiResizablePane [defaultSize]=\"30\" [minSize]=\"15\">...</div>`. `Resizable` reads `defaultSize`, `minSize` and `maxSize` once to lay out the group, then writes `size` as the user drags or keys the separators.",
  props: [
    {
      name: "defaultSize",
      kind: "input",
      required: false,
      type: "number | undefined",
      defaultValue: "undefined",
      description: "Initial size, as a percentage of the group. Panes that omit it share the remaining space equally.",
    },
    {
      name: "minSize",
      kind: "input",
      required: false,
      type: "number",
      defaultValue: "10",
      description: "Minimum size (%) this pane can be resized down to.",
    },
    {
      name: "maxSize",
      kind: "input",
      required: false,
      type: "number",
      defaultValue: "90",
      description: "Maximum size (%) this pane can be resized up to.",
    },
  ],
};
