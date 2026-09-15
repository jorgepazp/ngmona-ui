// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const commandApi: ComponentApiDoc = {
  name: "Command",
  description: "Command palette (⌘K-style) shown as a centered dialog with a search input that filters a grouped list of actions, with full keyboard navigation and a `selected` output emitting the chosen item's `value`. Bind `[(open)]` to control visibility. Opening it globally, for example from a keyboard shortcut, is left to the consuming page.",
  props: [
    {
      name: "open",
      kind: "model",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Whether the palette dialog is visible. Two-way bindable via `[(open)]`.",
    },
    {
      name: "groups",
      kind: "input",
      required: false,
      type: "CommandGroupDef[]",
      defaultValue: "[]",
      description: "Grouped list of actions shown in the palette, each rendered under its group's label.",
    },
    {
      name: "placeholder",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "'Type a command or search...'",
      description: "Placeholder text for the search input.",
    },
    {
      name: "emptyText",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "'No results found.'",
      description: "Message shown when no item matches the current query.",
    },
    {
      name: "closeOnBackdrop",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "true",
      description: "Whether clicking the backdrop closes the palette.",
    },
    {
      name: "selected",
      kind: "output",
      required: false,
      type: "unknown",
      defaultValue: "",
      description: "Fires with the chosen item's `value` when the user picks (click or Enter) an item; also closes the palette.",
    },
  ],
};
