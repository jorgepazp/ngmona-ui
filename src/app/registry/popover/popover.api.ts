// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const popoverApi: ComponentApiDoc = {
  name: "Popover",
  description: "Generic trigger and floating panel. Mark the trigger element with the `trigger` attribute; every other projected child becomes the panel body, rendered only once the popover opens.",
  props: [
    {
      name: "open",
      kind: "model",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Whether the panel is open. Two-way bindable via `[(open)]`; also flips back to `false` when the panel closes itself (outside click, escape).",
    },
    {
      name: "matchTriggerWidth",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Stretches the panel to match the trigger's width instead of sizing to its own content.",
    },
    {
      name: "panelClass",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes applied to the floating panel element.",
    },
    {
      name: "placement",
      kind: "input",
      required: false,
      type: "'bottom' | 'top'",
      defaultValue: "'bottom'",
      description: "Preferred side of the trigger to open on.",
    },
  ],
};
