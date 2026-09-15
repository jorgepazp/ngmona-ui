// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const toggleApi: ComponentApiDoc = {
  name: "Toggle",
  description: "Boolean on/off switch with native forms interop (`ControlValueAccessor`, works with `formControlName`/`ngModel`) and a signal-based `[(checked)]` two-way binding for standalone usage.",
  props: [
    {
      name: "checked",
      kind: "model",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "On/off state. Two-way bindable via `[(checked)]`.",
    },
    {
      name: "color",
      kind: "input",
      required: false,
      type: "ToggleColor",
      defaultValue: "'default'",
      description: "Track color shown while checked.",
    },
    {
      name: "size",
      kind: "input",
      required: false,
      type: "'default' | 'lg'",
      defaultValue: "'default'",
      description: "Size of the track/thumb.",
    },
    {
      name: "disabled",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Disables interaction and marks the control as disabled for `ControlValueAccessor` consumers.",
    },
    {
      name: "ariaLabel",
      kind: "input",
      required: false,
      type: "string | undefined",
      defaultValue: "undefined",
      description: "Accessible label for screen readers, since the control has no visible text.",
    },
  ],
};
