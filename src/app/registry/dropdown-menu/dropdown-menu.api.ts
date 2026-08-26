// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const dropdownMenuApi: ComponentApiDoc = {
  name: "DropdownMenu",
  description: "Trigger button + floating panel, with named `button`/`menu` templates (via `uiTemplate`) for custom trigger content and menu items — falls back to plain text if omitted. Menu semantics: trigger has `aria-haspopup=\"menu\"` + `aria-expanded`, the panel has `role=\"menu\"`, closes on outside click and Escape (returning focus to the trigger), and Up/Down/Home/End arrow keys move focus between elements marked `role=\"menuitem\"` inside the panel content the caller provides.",
  props: [
    {
      name: "disabled",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Disables the trigger entirely — it no longer responds to clicks and `buttonClicked` never fires.",
    },
    {
      name: "disableMenu",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Keeps the trigger clickable (still emits `buttonClicked`) but prevents the panel itself from opening.",
    },
    {
      name: "open",
      kind: "model",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Whether the panel is visible. Two-way bindable via `[(open)]`.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the trigger button, for one-off overrides.",
    },
    {
      name: "ariaLabel",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "'Menu'",
      description: "Accessible label applied to the trigger button.",
    },
    {
      name: "opened",
      kind: "output",
      required: false,
      type: "void",
      defaultValue: "",
      description: "Fires whenever the panel finishes opening.",
    },
    {
      name: "closed",
      kind: "output",
      required: false,
      type: "void",
      defaultValue: "",
      description: "Fires whenever the panel finishes closing, however it was closed (toggle, outside click, Escape, Tab).",
    },
    {
      name: "buttonClicked",
      kind: "output",
      required: false,
      type: "void",
      defaultValue: "",
      description: "Fires on every trigger click, even when `disableMenu` is `true` and no panel opens.",
    },
  ],
};
