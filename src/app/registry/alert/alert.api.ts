// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const alertApi: ComponentApiDoc = {
  name: "Alert",
  description: "Inline banner for contextual messages within page content, such as a warning above a form. Use `Notification` instead for temporary, toast-like messages. `type` sets the icon, color and ARIA role: `error` uses `role=\"alert\"` to interrupt, the other types use `role=\"status\"`. There is no `open` input; dismissing hides the alert internally and emits `dismissed` so the caller can react, e.g. to remove it from a list.",
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
