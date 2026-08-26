// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const smoothHeightDirectiveApi: ComponentApiDoc = {
  name: "SmoothHeightDirective",
  description: "Animates height changes on an element whose content resizes in place, e.g. `<div [smoothHeight]=\"items.length\">`. `animate.enter`/`animate.leave` (the native replacement for the old `collapsable` trigger) only fire when the *element itself* is inserted/removed, so they can't handle this case — the element stays mounted the whole time, only its content size changes. Instead this observes the host's real rendered height via `ResizeObserver` and, on any change, plays a Web Animations API transition from the previous height to the new one. The original directive tried to approximate this by re-triggering the `collapsable` trigger on every input change and threading a `startHeight` animation param through it — but `collapsable` never referenced that param anywhere, so it was silently ignored, and the \"before\" height was read synchronously inside an `effect()`, which runs after change detection has already applied the new DOM state, capturing the *new* height under the `startHeight` name. `ResizeObserver` sidesteps both bugs: its callback fires only once the browser has actually laid out the new size, so the height compared against is always correct regardless of effect/CD ordering. The `smoothHeight` input is kept only so the attribute selector `[smoothHeight]` still has something to bind to per the original API — height changes are now detected automatically from whatever causes them, not from this input's identity changing.",
  props: [
    {
      name: "smoothHeight",
      kind: "input",
      required: false,
      type: "unknown",
      defaultValue: "",
      description: "Kept for API compatibility with `[smoothHeight]=\"...\"`; the value itself isn't read.",
    },
  ],
};
