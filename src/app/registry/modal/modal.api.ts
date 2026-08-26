// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const modalApi: ComponentApiDoc = {
  name: "Modal",
  description: "Controlled dialog: the caller owns `open` (typically a signal bound with `[open]`) and reacts to `closed` to flip it back to `false` — the component never mutates its own visibility, so there's no timer choreography like the original's `translate-y` transition dance. The fade animation fires automatically on the `@if` block's enter/leave via `animate.enter`/`animate.leave`. The original (FTD/uiSDP forks) repositioned itself on resize via a hand-rolled `ResizeObserver`/`MutationObserver` pair that queried `document.querySelector('.modal-content')` — a global lookup that would grab the wrong element as soon as two modals existed on the page. That machinery existed to patch a layout that mixed `absolute` positioning with flex centering; this version centers the panel with plain in-flow flexbox + `max-height`/`overflow-y-auto` instead, so oversized content already fits the viewport with pure CSS and no observers. Focus is trapped inside the panel while open (Tab/Shift+Tab wrap at the panel edges) and restored to whatever triggered the modal once it closes.",
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
