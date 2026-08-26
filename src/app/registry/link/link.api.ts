// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const linkApi: ComponentApiDoc = {
  name: "Link",
  description: "Text link with optional leading/trailing icon and underline behavior. Fixes carried over from the original: `target` no longer defaults to `_blank` — the base fork forced every link (including internal/in-app ones) to open a new tab unconditionally, which is rarely what you want; callers now opt in explicitly. `rel=\"noopener noreferrer\"` is applied automatically whenever `target=\"_blank\"` is set (FTD/uiSDP added this by hand but only on the base string, not derived from `target`, so it stayed correct only by coincidence). The disabled state (added by FTD/uiSDP, missing from base) is merged in. Color now uses the dedicated `--color-link-*` token family instead of `text-info-500` — same value, but the correct semantic token instead of borrowing the info color.",
  props: [
    {
      name: "href",
      kind: "input",
      required: false,
      type: "string | undefined",
      defaultValue: "undefined",
      description: "Destination URL, applied as the native `href`. Omitted (or `disabled`) renders a non-navigating anchor.",
    },
    {
      name: "target",
      kind: "input",
      required: false,
      type: "LinkTarget | undefined",
      defaultValue: "undefined",
      description: "Native `target` attribute. `'_blank'` automatically adds `rel=\"noopener noreferrer\"` and an sr-only \"opens in a new tab\" hint.",
    },
    {
      name: "underline",
      kind: "input",
      required: false,
      type: "LinkUnderline",
      defaultValue: "'hover'",
      description: "Underline behavior for the link text.",
    },
    {
      name: "icon",
      kind: "input",
      required: false,
      type: "LucideIconInput | undefined",
      defaultValue: "undefined",
      description: "Icon shown alongside the link text. Accepts a Lucide icon component or icon data.",
    },
    {
      name: "iconPos",
      kind: "input",
      required: false,
      type: "'left' | 'right'",
      defaultValue: "'left'",
      description: "Side the `icon` renders on, relative to the projected link text.",
    },
    {
      name: "disabled",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Strips the `href`, applies the disabled visual style, and prevents the click handler from firing.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the link's computed classes.",
    },
    {
      name: "clicked",
      kind: "output",
      required: false,
      type: "MouseEvent",
      defaultValue: "",
      description: "Emits the native click event; suppressed (and navigation prevented) while `disabled`.",
    },
  ],
};
