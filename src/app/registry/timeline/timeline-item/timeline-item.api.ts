// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../../docs-ui/api-table/api-table';

export const timelineItemApi: ComponentApiDoc = {
  name: "TimelineItem",
  description: "Single entry in a `ui-timeline`. Must be a direct child of `ui-timeline`. Supports plain `title`/`content` string inputs, or `marker`, `title` and `content` templates via `uiTemplate` for custom content. Set `activeMarker` to highlight the marker as the current entry.",
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
