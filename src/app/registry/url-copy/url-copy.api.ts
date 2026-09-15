// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const urlCopyApi: ComponentApiDoc = {
  name: "UrlCopy",
  description: "Click-to-copy URL chip. Copies `url` to the clipboard when clicked, and shows `copiedLabel` in place of `label` for `duration` ms as feedback. Emits `copied` once the URL has been successfully written to the clipboard, so callers can react, for example to log analytics.",
  props: [
    {
      name: "url",
      kind: "input",
      required: true,
      type: "string",
      defaultValue: "",
      description: "URL copied to the clipboard when the chip is clicked.",
    },
    {
      name: "label",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "'Copy URL'",
      description: "Label shown before copying.",
    },
    {
      name: "copiedLabel",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "'Copied!'",
      description: "Label shown in place of `label` for `duration` ms after a successful copy.",
    },
    {
      name: "duration",
      kind: "input",
      required: false,
      type: "number",
      defaultValue: "2000",
      description: "How long, in ms, the \"copied\" feedback state is shown before reverting to `label`.",
    },
    {
      name: "classNames",
      kind: "input",
      required: false,
      type: "string",
      defaultValue: "''",
      description: "Extra utility classes appended to the host button.",
    },
    {
      name: "copied",
      kind: "output",
      required: false,
      type: "void",
      defaultValue: "",
      description: "Emits once the URL has been successfully written to the clipboard.",
    },
  ],
};
