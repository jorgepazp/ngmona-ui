// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const alertApi: ComponentApiDoc = {
  name: "Alert",
  description: "Inline, static banner — unlike `Notification`, this isn't fixed-position/toast-like, it's meant to sit directly in page content (e.g. above a form). Uncontrolled: dismissing hides it via an internal signal (no `open`/`show` input to wire up for the common case), but a `dismissed` output is still emitted so a caller can react (e.g. remove it from a list). `type` drives both the icon and the color, same pattern as `Notification`, and the same `alert`/`status` role split: `error` interrupts (`role=\"alert\"`), everything else is announced politely (`role=\"status\"`) since it doesn't need to steal focus to be noticed.",
  props: [
    {
      name: "type",
      kind: "input",
      required: false,
      type: "AlertType",
      defaultValue: "'info'",
      description: "Semantic type — drives the default icon, color, and the `alert`/`status` ARIA role split (see class doc).",
    },
    {
      name: "heading",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Optional bold heading rendered above the body content.",
    },
    {
      name: "icon",
      kind: "input",
      required: false,
      type: "LucideIconInput | undefined",
      defaultValue: "undefined",
      description: "Overrides the default icon derived from `type`.",
    },
    {
      name: "showIcon",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "true",
      description: "Hides the leading icon entirely when `false`.",
    },
    {
      name: "dismissible",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Shows a close button that hides the alert when clicked (see the `dismissed` output).",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the root element.",
    },
    {
      name: "dismissed",
      kind: "output",
      required: false,
      type: "void",
      defaultValue: "",
      description: "Fires when the built-in dismiss button is clicked.",
    },
  ],
};
