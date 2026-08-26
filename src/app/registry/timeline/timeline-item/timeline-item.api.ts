// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../../docs-ui/api-table/api-table';

export const timelineItemApi: ComponentApiDoc = {
  name: "TimelineItem",
  description: "Single entry in a `ui-timeline`. Must be a direct child of `<ui-timeline>` — renders as a plain `<li>` (`:host { display: contents }`) so the parent's `<ol>`/`<li>` structure stays real. Supports plain `title`/`content` string inputs, or `<ng-template uiTemplate=\"marker|title|content\">` for custom content (same named-slot pattern as `Checkbox`'s label template). The original required a manually-set `isLast` @Input to hide the connector line past the final item — easy to forget, and silently wrong the moment items are added, removed, or reordered without updating it. Replaced here with Tailwind's `group-last:` variant driven by real DOM position, so it's always correct with no coordination needed from the parent or the consumer. Also fixes a typo'd, nonexistent `bg-color-surface-white` class (should have been `bg-surface-white`, the actual theme token) that silently left that patch transparent.",
  props: [
    {
      name: "title",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Static title text; ignored when a `uiTemplate=\"title\"` is projected.",
    },
    {
      name: "content",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Static body text; ignored when a `uiTemplate=\"content\"` is projected.",
    },
    {
      name: "activeMarker",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Highlights the marker as the active/current entry (a small filled dot instead of an outline).",
    },
  ],
};
