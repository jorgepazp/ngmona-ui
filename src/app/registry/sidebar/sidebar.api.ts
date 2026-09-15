// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const sidebarApi: ComponentApiDoc = {
  name: "Sidebar",
  description: "Responsive app-shell layout: a persistent navigation column on desktop that collapses to a hamburger button and top bar on mobile, opening the same navigation as an off-canvas panel. Wrap the page body as the default projected content. This component is meant to sit once at the root of a routed app, rather than nested per page. Provide the navigation itself with a `content` template via `uiTemplate`, and optional `header`/`footer` templates for chrome such as a logo or a user menu, shown in both layouts. `breakpoint` sets the Tailwind breakpoint at and above which the navigation becomes a persistent column instead of an off-canvas panel.",
  props: [
    {
      name: "mobileOpen",
      kind: "model",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Whether the mobile off-canvas nav is open. Two-way bindable via `[(mobileOpen)]`.",
    },
    {
      name: "breakpoint",
      kind: "input",
      required: false,
      type: "SidebarBreakpoint",
      defaultValue: "'md'",
      description: "Tailwind breakpoint at/above which the nav becomes a persistent column instead of an off-canvas panel.",
    },
    {
      name: "width",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "'16rem'",
      description: "Width of the persistent desktop nav column (any CSS width value).",
    },
    {
      name: "title",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Shown in the mobile top bar next to the hamburger button, and as the mobile nav panel's accessible name.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the root layout element.",
    },
    {
      name: "navClassNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the `<nav>` element in both layouts.",
    },
    {
      name: "closeOnMobileNavigate",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "true",
      description: "Closes the mobile off-canvas nav automatically when a click bubbles up from inside it (e.g. a nav link).",
    },
  ],
};
