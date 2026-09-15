// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const breadcrumbApi: ComponentApiDoc = {
  name: "Breadcrumb",
  description: "Navigation trail showing the path to the current page. Built from `items` rather than projected content, so the current-page treatment and the separators between items are handled automatically. Every item except the last renders as a `ui-link`; the last renders as plain text with `aria-current=\"page\"`.",
  props: [
    {
      name: "items",
      kind: "input",
      required: true,
      type: "BreadcrumbItem[]",
      defaultValue: "",
      description: "Ordered breadcrumb trail; the last item renders as the current page (plain text, not a link).",
    },
    {
      name: "separatorIcon",
      kind: "input",
      required: false,
      type: "LucideIconInput",
      defaultValue: "LucideChevronRight",
      description: "Icon rendered between items. Defaults to a chevron pointing right.",
    },
    {
      name: "ariaLabel",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "'Breadcrumb'",
      description: "Accessible name for the `<nav>` landmark.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the `<nav>` element.",
    },
    {
      name: "itemClick",
      kind: "output",
      required: false,
      type: "{ item: BreadcrumbItem; index: number; event: MouseEvent }",
      defaultValue: "",
      description: "Fires when a non-current (linked) item is clicked, alongside `ui-link`'s native click.",
    },
  ],
};
