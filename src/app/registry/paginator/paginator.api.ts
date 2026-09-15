// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const paginatorApi: ComponentApiDoc = {
  name: "Paginator",
  description: "Page-number navigation with previous and next buttons plus a condensed page-number range that collapses to ellipses for large page counts. Purely presentational: it only controls a `page` index. Slicing the underlying dataset is left to the caller. Use `siblingCount` to control how many page numbers show on each side of the current page.",
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
