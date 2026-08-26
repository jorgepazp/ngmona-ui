// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const inputGroupApi: ComponentApiDoc = {
  name: "InputGroup",
  description: "Layout primitive that visually joins prefix/suffix addons (icons, text, buttons) with a projected input into one bordered unit — e.g. `$` + amount + `.00`, or a search box + \"Go\" button. It is *not* a form control: it carries no value, implements no `ControlValueAccessor`, and needs no special ARIA beyond whatever the projected children already provide. Border/focus styling reacts to the focus state of anything inside the group via `:focus-within`, so the projected control doesn't need its own border/outline — strip those off (see the docs page for the exact classes) so only the group's border shows. Addons are plain content projection rather than named `UiTemplateDirective` slots: `[prefix]`/ `[suffix]` attribute selectors are simpler for \"arbitrary markup on either side of an input\" and don't need the indirection of a named `<ng-template>`.",
  props: [
    {
      name: "disabled",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Dims the group and disables pointer interaction with everything projected inside it.",
    },
    {
      name: "state",
      kind: "input",
      required: false,
      type: "InputGroupState",
      defaultValue: "null",
      description: "Validation state — tints the border success/warning/error; `null` for the neutral default.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the wrapper.",
    },
  ],
};
