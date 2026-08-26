// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const notificationApi: ComponentApiDoc = {
  name: "Notification",
  description: "Toast-style notification, positioned fixed to a screen corner/edge. Controlled via `show`, like `Modal` — the caller flips it back to `false` on `closed` instead of the component managing its own visibility. The original drove its slide-in/out with a position-aware `translate-x`/`translate-y` switch timed by an `rxjs` `timer(200)`, mirroring the same choreography bug pattern as the original Modal. That's replaced with a fade animation on the `@if` block's enter/leave via `animate.enter`/`animate.leave`. Multi-brand `type` values (`accent-tbk`/`accent-onepay`/`accent-webpay`/`custom`) are dropped — see `styles.css` for why the brand palette collapsed to a single `primary`/`accent` pair. `hideCloseButton` (default `true`, i.e. no close button unless explicitly turned off) is renamed to `showCloseButton` (default `true`, i.e. shown unless explicitly turned off) to match `Modal`'s naming and drop the double-negative default. `stacked` (default `false`) drops the built-in `fixed`+corner-position classes so a parent can lay several of these out itself — used by `Toaster` (`../toast.ts`) to stack multiple queued toasts in the same corner instead of having them all render on top of each other.",
  props: [
    {
      name: "show",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Controls visibility, like `Modal`'s `open` — the caller flips it back to `false` on `(closed)`.",
    },
    {
      name: "type",
      kind: "input",
      required: false,
      type: "NotificationType",
      defaultValue: "'info'",
      description: "Semantic/visual style; also drives whether it announces as `alert`/`assertive` (`'error'`) or `status`/`polite` (everything else).",
    },
    {
      name: "position",
      kind: "input",
      required: false,
      type: "NotificationPosition",
      defaultValue: "'top-center'",
      description: "Screen corner/edge the notification is anchored to. Ignored when `stacked` is `true`.",
    },
    {
      name: "showCloseButton",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "true",
      description: "Shows the built-in `X` close button.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the notification.",
    },
    {
      name: "stacked",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Drops the built-in fixed positioning/corner classes so a parent (e.g. `Toaster`) can lay out several instances itself.",
    },
    {
      name: "closed",
      kind: "output",
      required: false,
      type: "void",
      defaultValue: "",
      description: "Emitted when the close button is clicked — the caller should set `show` to `false`.",
    },
  ],
};
