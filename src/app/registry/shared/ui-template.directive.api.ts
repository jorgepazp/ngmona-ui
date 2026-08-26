// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const uiTemplateDirectiveApi: ComponentApiDoc = {
  name: "UiTemplateDirective",
  description: "Named content-projection slot, e.g. `<ng-template uiTemplate=\"label\">...</ng-template>`. Lets a component accept an optional custom template for a specific named region instead of (or in addition to) a plain string @Input.",
  props: [
    {
      name: "name",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "'', { alias: 'uiTemplate' }",
      description: "The slot name a hosting component looks up via `contentChildren(UiTemplateDirective)` (e.g. `'label'`, `'header'`, `'cell-status'`).",
    },
  ],
};
