// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const tooltipDirectiveApi: ComponentApiDoc = {
  name: "TooltipDirective",
  description: "Shows a tooltip panel near the host element on hover, focus, or touch-and-hold. Set the tooltip text directly on the directive: `[uiTooltip]=\"'Some text'\"`. Automatically flips to the opposite side of `position` when the requested side doesn't fit in the viewport. Use `showDelay` and `hideDelay` to delay showing or hiding, and `forceVisible` to control visibility programmatically instead of relying on hover, focus or touch.",
  props: [
    {
      name: "uiTooltip",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Plain-text tooltip content; ignored when `template` is provided.",
    },
    {
      name: "heading",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Optional bold heading shown above the body content.",
    },
    {
      name: "template",
      kind: "input",
      required: false,
      type: "TemplateRef<unknown> | undefined",
      defaultValue: "undefined",
      description: "Custom body content, rendered instead of `uiTooltip` when set.",
    },
    {
      name: "position",
      kind: "input",
      required: false,
      type: "TooltipPosition",
      defaultValue: "'right'",
      description: "Side of the host element the tooltip is placed on.",
    },
    {
      name: "showDelay",
      kind: "input",
      required: false,
      type: "number",
      defaultValue: "0",
      description: "Delay in ms before the tooltip appears after a show-triggering event.",
    },
    {
      name: "hideDelay",
      kind: "input",
      required: false,
      type: "number",
      defaultValue: "0",
      description: "Delay in ms before the tooltip disappears after a hide-triggering event.",
    },
    {
      name: "width",
      kind: "input",
      required: false,
      type: "number",
      defaultValue: "231",
      description: "Max width of the tooltip panel in pixels.",
    },
    {
      name: "forceVisible",
      kind: "input",
      required: false,
      type: "boolean | undefined",
      defaultValue: "undefined, { alias: 'uiTooltipVisible' }",
      description: "Overrides hover/focus/touch handling to show or hide the tooltip programmatically.",
    },
  ],
};
