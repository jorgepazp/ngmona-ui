// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../../docs-ui/api-table/api-table';

export const accordionItemApi: ComponentApiDoc = {
  name: "AccordionItem",
  description: "Single entry in a `ui-accordion`. Must be a direct child of `<ui-accordion>` — like `TimelineItem`, renders as `:host { display: contents }` so the parent's layout stays real, and reads/drives its expanded state through the injected parent `Accordion` instead of owning it. The panel stays mounted at all times and animates via a plain CSS `grid-template-rows` transition (0fr collapsed, 1fr expanded) instead of `@if` + `animate.enter`/`animate.leave` like `DropdownMenu`'s panel. That JS-driven approach (measuring `scrollHeight`, animating via the Web Animations API) forces a synchronous layout read right as the animation starts, and rebuilds the projected content from scratch on every toggle — both show up as a visible hitch in an accordion, where a single-open toggle also means a sibling item is animating closed in the same flex column at the same time. The CSS-only version needs neither: `inert` (bound off `expanded`) keeps the collapsed panel out of the tab order and the accessibility tree, matching what removing it from the DOM used to guarantee, with `role=\"region\"` + `aria-labelledby` pointing at the header button, and the header button carries `aria-expanded`/`aria-controls`. Header buttons stay in the normal tab order (per the WAI-ARIA accordion pattern); Up/Down/Home/End additionally move focus between them without changing that order.",
  props: [
    {
      name: "value",
      kind: "input",
      required: true,
      type: "string",
      defaultValue: "",
      description: "Unique identifier for this item, matched against the parent `Accordion`'s `expandedValues`.",
    },
    {
      name: "heading",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Header text shown in the trigger button; ignored when a `uiTemplate=\"header\"` is projected.",
    },
    {
      name: "disabled",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Prevents this item's header from being toggled open/closed.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the item's root element.",
    },
  ],
};
