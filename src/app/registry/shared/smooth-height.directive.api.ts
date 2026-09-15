// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const smoothHeightDirectiveApi: ComponentApiDoc = {
  name: "SmoothHeightDirective",
  description: "Animates height changes on an element whose content resizes in place, e.g. `<div [smoothHeight]=\"items.length\">`. Observes the host's rendered height and plays a transition from the previous height to the new one whenever it changes.",
  props: [
    {
      name: "smoothHeight",
      kind: "input",
      required: false,
      type: "unknown",
      defaultValue: "",
      description: "Kept for API compatibility with `[smoothHeight]=\"...\"`; the value itself isn't read.",
    },
  ],
};
