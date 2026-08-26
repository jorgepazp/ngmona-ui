// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const sidebarApi: ComponentApiDoc = {
  name: "Sidebar",
  description: "Responsive app-shell layout: a persistent nav column on desktop that collapses to a hamburger button + top bar on mobile, opening the same nav as an off-canvas panel. Wraps the page body (passed as default content) next to the nav, so it's meant to sit once at the root of a routed app (e.g. replacing a hand-rolled header+nav+main layout), not nested per-page. The nav itself is a single `uiTemplate=\"content\"` template, instantiated twice (desktop aside + mobile drawer) via `ngTemplateOutlet` — not `<ng-content>`, which can only render its projected nodes in one place. `header`/`footer` templates are optional chrome (e.g. a logo, a user menu) shown above/below the nav in both layouts. The mobile off-canvas panel reuses `Drawer` (`side=\"left\"`) rather than reimplementing backdrop/focus-trap/Escape-to-close/slide-in behavior — on mobile this component's nav really is just a left `Drawer` with a hamburger trigger.",
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
