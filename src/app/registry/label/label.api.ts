// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const labelApi: ComponentApiDoc = {
  name: "Label",
  description: "Small pill-shaped tag/badge. Identical logic across all three forks. The original shipped a sibling `label.component.css` with `@apply`-based classes (`.info-label`, `.success-label`, `.warning-label`, `.danger-label`, `.tbk-label`, `.tbk-label-generic`) that were never referenced by the template (`getColorClass()` only ever returned `bg-warning-300` or `bg-neutral-500`) — dead code, dropped entirely. `.tbk-label` also referenced `bg-transbank-300`, a class that doesn't exist in any Tailwind config in any of the three forks. `mb-0` (added by FTD/uiSDP, missing from base) is kept to stop the label from picking up a stray bottom margin.",
  props: [
    {
      name: "color",
      kind: "input",
      required: false,
      type: "LabelColor",
      defaultValue: "'normal'",
      description: "Visual color scheme — `'highlight'` renders on a warning-tinted background, `'normal'` on neutral gray.",
    },
  ],
};
