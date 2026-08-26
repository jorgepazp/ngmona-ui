// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const radioApi: ComponentApiDoc = {
  name: "Radio",
  description: "A single native radio input with forms interop (`ControlValueAccessor`) plus a signal-based `[(checked)]` binding. Group several by giving them the same `name`.",
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
      name: "value",
      kind: "input",
      required: false,
      type: "T | undefined",
      defaultValue: "undefined",
      description: "Value emitted via `selected` when this radio becomes checked.",
    },
    {
      name: "label",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Static label text rendered next to the radio input.",
    },
    {
      name: "name",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Native `name` attribute — radios sharing a `name` form a mutually-exclusive group.",
    },
    {
      name: "disabled",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Disables user interaction.",
    },
    {
      name: "ariaLabel",
      kind: "input",
      required: false,
      type: "string | undefined",
      defaultValue: "undefined",
      description: "Accessible name to use when there's no visible `label` (e.g. a radio used on its own in a compact row).",
    },
    {
      name: "selected",
      kind: "output",
      required: false,
      type: "T | undefined",
      defaultValue: "",
      description: "Emits this radio's `value` when it becomes checked via user interaction.",
    },
  ],
};
