// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const popoverApi: ComponentApiDoc = {
  name: "Popover",
  description: "Generic trigger + floating panel. Mark the trigger element with the `trigger` attribute (projected via `[trigger]`); everything else passed as content becomes the panel body, only rendered once the popover opens: ```html <ui-popover [(open)]=\"isOpen\"> <button trigger>Open</button> <div class=\"p-2\">Panel content</div> </ui-popover> ``` Built on `FloatingPanel` (CDK Overlay) — the same primitive `Combobox`/`Autocomplete`/`Command` use directly when they need tighter control over their own markup instead of content projection.",
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
