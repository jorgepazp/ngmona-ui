// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const notificationApi: ComponentApiDoc = {
  name: "Notification",
  description: "Toast-style notification anchored to a corner or edge of the screen. Controlled via `show`, similar to `Modal`: set it back to `false` when `(closed)` fires. `type` sets the icon, color and ARIA role: `error` interrupts, the rest announce politely. Set `stacked` to drop the built-in fixed positioning so a parent, such as `Toaster`, can lay out several notifications itself.",
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
