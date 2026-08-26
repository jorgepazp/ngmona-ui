// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const urlCopyApi: ComponentApiDoc = {
  name: "UrlCopy",
  description: "Click-to-copy URL chip. All three source copies were identical. Changes from the original: - `url` was a plain `@Input()` defaulting to a hardcoded `www.transbank.cl/firmacontrato/ejemplo` URL. It's now `input.required<string>()` — there is no sensible generic default for a URL. - The original rendered a `<div (click)=\"copyUrl()\">`, which is not keyboard-operable and has no accessible role — a real a11y bug. It's now a real `<button type=\"button\">`. - The \"copied\" feedback was a `tbk-notification` toast in the top-right corner of the *page*, entirely disconnected from the control that triggered it. That component isn't part of this migration batch (and pulling in a whole toast/notification system for one chip is overkill for a copy-paste primitive), so feedback is now inline: the icon and trailing label swap to a checkmark + `copiedLabel` for `duration` ms, then revert. This also fixes a dead `showNotification` input that was declared but never actually read anywhere in the original template — the notification always showed regardless of its value. - `notificationText` (Spanish default \"Enlace copiado\") is renamed `copiedLabel` (default \"Copied!\"); `label` default is now \"Copy URL\" instead of \"Copiar URL\" — component defaults are English now, same as Button/Checkbox. - Adds a `copied` output so consumers can react (e.g. analytics) without polling clipboard state.",
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
