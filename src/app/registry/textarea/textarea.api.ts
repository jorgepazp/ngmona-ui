// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const textareaApi: ComponentApiDoc = {
  name: "Textarea",
  description: "Multi-line text input with native forms interop (`ControlValueAccessor`, works with `formControlName`/`ngModel`) and a signal-based `[(value)]` two-way binding for standalone usage. Shows a live character counter under the field whenever `maxLength` is set and no `caption`/caption template is provided.",
  props: [
    {
      name: "value",
      kind: "model",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Current text. Two-way bindable via `[(value)]`.",
    },
    {
      name: "disabled",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Disables the field and marks it as disabled for `ControlValueAccessor` consumers.",
    },
    {
      name: "placeholder",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Placeholder text shown in the field when empty.",
    },
    {
      name: "label",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Static label text shown above the field; ignored when a `uiTemplate=\"label\"` is projected.",
    },
    {
      name: "caption",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Static caption text shown below the field; ignored when a `uiTemplate=\"caption\"` is projected.",
    },
    {
      name: "id",
      kind: "input",
      required: false,
      type: "string | undefined",
      defaultValue: "undefined",
      description: "Overrides the auto-generated id used to link the `<label for>` and `aria-describedby`.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the `<textarea>` element, for one-off overrides.",
    },
    {
      name: "maxLength",
      kind: "input",
      required: false,
      type: "number | undefined",
      defaultValue: "undefined",
      description: "Enforces the native `maxlength` attribute and, when set, shows a \"current / max\" character counter.",
    },
  ],
};
