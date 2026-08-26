// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const checkboxApi: ComponentApiDoc = {
  name: "Checkbox",
  description: "Checkbox with native forms interop (`ControlValueAccessor`, works with `formControlName`/ `ngModel`) and a signal-based `[(checked)]` two-way binding for standalone usage. Fixes carried over from the original: the visible label is now inside the `<label>` element (previously a sibling `<span>`, so clicking the text or reading it via a screen reader never worked), and the change output now fires on every user interaction (previously it only fired from `writeValue`, i.e. programmatic sets — a bug the original left a TODO comment about).",
  props: [
    {
      name: "checked",
      kind: "model",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Checked state. Two-way bindable via `[(checked)]`.",
    },
    {
      name: "label",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Static label text rendered next to the box; ignored when a `uiTemplate=\"label\"` is projected.",
    },
    {
      name: "disabled",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Disables the checkbox and applies the disabled visual style.",
    },
    {
      name: "indeterminate",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Presentation-only \"mixed\" visual state (e.g. a \"select all\" checkbox with a partial selection). Doesn't affect `checked`.",
    },
  ],
};
