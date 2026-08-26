// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const autocompleteApi: ComponentApiDoc = {
  name: "Autocomplete",
  description: "Free-text input with a filterable, keyboard-navigable suggestions dropdown. Unlike `Combobox`, whatever the user types IS the committed `value` — suggestions are only an assist, never a constraint, so submitting text that matches nothing in `suggestions()` is fully supported. This is the `FloatingPanel`-based, keyboard-navigable evolution of `Input`'s `searchIn` feature (which was click-only). Built directly on `FloatingPanel` rather than `Combobox` because the \"value is always whatever's typed\" semantics don't fit `Combobox`'s \"value is always one of the options\" contract.",
  props: [
    {
      name: "suggestions",
      kind: "input",
      required: false,
      type: "string[]",
      defaultValue: "[]",
      description: "Full suggestion list; filtered client-side against the current `value` (case-insensitive substring match).",
    },
    {
      name: "placeholder",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Placeholder text shown in the input when empty.",
    },
    {
      name: "label",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Field label rendered above the input.",
    },
    {
      name: "caption",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Helper text rendered below the input.",
    },
    {
      name: "disabled",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Disables the input and closes the suggestions panel.",
    },
    {
      name: "id",
      kind: "input",
      required: false,
      type: "string | undefined",
      defaultValue: "undefined",
      description: "Native `id` for the input; auto-generated when omitted.",
    },
    {
      name: "value",
      kind: "model",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Current text value. Two-way bindable via `[(value)]`; always reflects whatever's typed, whether or not it matches a suggestion.",
    },
    {
      name: "selected",
      kind: "output",
      required: false,
      type: "string",
      defaultValue: "",
      description: "Fires when the user picks a suggestion from the dropdown (not fired when free-typed text is simply committed).",
    },
  ],
};
