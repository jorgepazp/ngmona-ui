// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const paginatorApi: ComponentApiDoc = {
  name: "Paginator",
  description: "Page-number navigation bar: previous/next buttons plus a condensed page-number range with ellipses (first, last, current ± `siblingCount`). Purely presentational — it controls a `page` index, the caller slices its own dataset based on that. The original bundled this together with dataset slicing and three named content-projection slots (item template / info template / empty-state template), conflating two unrelated responsibilities — rendering a list vs. picking a page — into one component. Split apart here: `Paginator` now only owns the page-range control, matching how mainstream libraries model this (MUI Pagination, Ant Design Pagination, PrimeNG Paginator all separate the two). The page-range algorithm is also a full rewrite: the original `doPaging()` had accumulated special-cased magic numbers (`i != 4`, `pageCount - 5`, `currentPage != 4`) that read like unfixed edge-case patches rather than a designed algorithm; this uses the standard sibling+ellipsis range algorithm.",
  props: [
    {
      name: "page",
      kind: "model",
      required: false,
      type: "number",
      defaultValue: "0",
      description: "Zero-based current page index. Two-way bindable via `[(page)]`.",
    },
    {
      name: "pageCount",
      kind: "input",
      required: true,
      type: "number",
      defaultValue: "",
      description: "Total number of pages.",
    },
    {
      name: "siblingCount",
      kind: "input",
      required: false,
      type: "number",
      defaultValue: "1",
      description: "How many page numbers to show on each side of the current page.",
    },
    {
      name: "disabled",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Disables the previous/next buttons and every page-number button.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the nav element.",
    },
  ],
};
