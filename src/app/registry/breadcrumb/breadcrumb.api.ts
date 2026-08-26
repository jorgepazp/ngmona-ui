// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const breadcrumbApi: ComponentApiDoc = {
  name: "Breadcrumb",
  description: "Breadcrumb trail. Data-driven via `items` rather than content-projected, so the last-item \"current page\" treatment and the separators between items can be derived structurally instead of asking every consumer to remember to mark them by hand. Every item except the last renders through `ui-link` (this library's existing Link component) so it inherits its focus/hover/disabled treatment for free. The last item is current-page: it renders as plain text with `aria-current=\"page\"` (not a link — you're already there) per the WAI-ARIA breadcrumb pattern. Separator icons between items are `aria-hidden` since the `<ol>` list structure already conveys the hierarchy to assistive tech; the trailing `nav[aria-label]` is what identifies the whole region as a breadcrumb landmark.",
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
