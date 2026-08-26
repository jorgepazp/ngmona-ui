// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const tooltipDirectiveApi: ComponentApiDoc = {
  name: "TooltipDirective",
  description: "`[uiTooltip]=\"'Some text'\"` — shows a `Tooltip` panel near the host element on hover, focus, or touch-and-hold. Modernized from the original `ComponentFactoryResolver`-based implementation (deprecated since Angular 13, and the whole reason this migration was called out): `ViewContainerRef.createComponent` takes the component type directly now, no factory resolver needed. The original also manually attached the view to `ApplicationRef` and appended its root node to `document.body` to escape ancestor clipping — since the panel is `position: fixed`, it's positioned relative to the viewport regardless of where it sits in the DOM, so that manual `attachView`/`appendChild`/ `detachView` dance is dropped; `ViewContainerRef.createComponent` alone is enough, and `componentRef.destroy()` cleans it up correctly. Also fixes a real accessibility gap: the original only listened for `mouseenter`/`mouseleave` and touch, so keyboard-only users could never trigger the tooltip. `focus`/`blur` handling is added here, plus `aria-describedby` on the host element pointing at the tooltip's `id` while it's visible, so screen readers announce it.",
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
