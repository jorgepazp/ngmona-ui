// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const modalApi: ComponentApiDoc = {
  name: "Modal",
  description: "Dialog that displays content in a layer above the page, blocking interaction with the rest of the UI until dismissed. Use it for confirmations, forms, or any content that needs the user's full attention. `open` is controlled by the caller: bind it to a signal and set it back to `false` when `(closed)` fires. Content can be projected directly, or split into `header`, `content` and `footer` sections with `uiTemplate` for full control over each region. Focus is trapped inside the panel while open (Tab/Shift+Tab wrap at the panel edges) and restored to the element that opened the modal once it closes.",
  props: [
    {
      name: "open",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Controls visibility. Owned by the caller — the modal never mutates it itself; flip it back to `false` on `(closed)`.",
    },
    {
      name: "heading",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Text rendered in the panel's header and linked via `aria-labelledby`; ignored when a `uiTemplate=\"header\"` is projected.",
    },
    {
      name: "closeOnBackdrop",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "true",
      description: "Whether clicking the backdrop overlay closes the modal.",
    },
    {
      name: "showCloseButton",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "true",
      description: "Shows the built-in `X` close button in the top-right corner.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the panel.",
    },
    {
      name: "role",
      kind: "input",
      required: false,
      type: "'dialog' | 'alertdialog'",
      defaultValue: "'dialog'",
      description: "ARIA role of the panel. `AlertDialog` overrides this to `'alertdialog'`.",
    },
    {
      name: "describedBy",
      kind: "input",
      required: false,
      type: "string | undefined",
      defaultValue: "undefined",
      description: "Id of an element (typically a description/message paragraph) to expose via `aria-describedby`.",
    },
    {
      name: "closed",
      kind: "output",
      required: false,
      type: "void",
      defaultValue: "",
      description: "Emitted when the modal requests to close (backdrop click, close button, or Escape) — the caller should set `open` to `false`.",
    },
  ],
};
