// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const fileUploadApi: ComponentApiDoc = {
  name: "FileUpload",
  description: "Single-file drop zone with a real `<input type=\"file\">` underneath — clicking, dragging a file onto it, or tabbing to it and pressing Enter/Space all work. The original hid the input with `class=\"hidden\"` (`display: none`, which also makes it unfocusable) behind a plain `<div (click)>` with no `tabindex`/`role`, so keyboard-only users had no way to open the file picker at all. Here the input is visually hidden with `sr-only` (stays focusable) and nested inside a `<label>`, so native label-activates-control behavior provides full keyboard support for free, with no custom key handling needed. Other fixes made while porting (the component was identical across both forks that had it): - `maxFileSizeInMB` returned only the first character of the string `maxFileSize / 1024` — correct by coincidence for the 8 MB default, wrong for almost any other value (e.g. 12 MB rendered as \"1 MB\"). Replaced with `Math.round(maxFileSizeBytes / 1024 / 1024)`. - The file picker's `accept` attribute was a hardcoded string, completely ignoring the `extensions` input — configuring `extensions` never changed what the OS file dialog offered. It's now derived from `extensions()`. - Extension validation compared the browser-reported MIME subtype against the `extensions` list, so a configured `'jpg'` entry could never match (browsers always report `.jpg` files as MIME type `image/jpeg`, never `image/jpg`) — dead, unreachable config. Validation now checks the actual filename extension first, with MIME type as a secondary signal. - Rejected files (wrong type, too large) silently did nothing — no feedback at all. Now surfaces a `role=\"alert\"` message. - Dropped the fake `rxjs` `delay(500)` \"upload\" — the component never actually uploaded anything over the network, so the spinner was simulating work that didn't exist. Selection is now synchronous; a `loading` input lets the caller show a spinner while *their* upload request is in flight. The default `jpg`/`jpeg`/`png`/`pdf` whitelist is kept as the default `extensions` value, not hardcoded as the only option — pass a different array to accept other file types.",
  props: [
    {
      name: "id",
      kind: "input",
      required: false,
      type: "string | undefined",
      defaultValue: "undefined",
      description: "DOM id for the underlying `<input type=\"file\">`; auto-generated when omitted.",
    },
    {
      name: "disabled",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Disables the drop zone entirely — no click, drag/drop, or keyboard activation opens the file picker.",
    },
    {
      name: "loading",
      kind: "input",
      required: false,
      type: "boolean",
      defaultValue: "false",
      description: "Set by the caller while their own upload request is in flight.",
    },
    {
      name: "extensions",
      kind: "input",
      required: false,
      type: "FileUploadExtension[]",
      defaultValue: "DEFAULT_FILE_UPLOAD_EXTENSIONS",
      description: "Allowed file extensions (no leading dot), used both to build the file picker's `accept` filter and to validate the chosen/dropped file.",
    },
    {
      name: "maxFileSizeBytes",
      kind: "input",
      required: false,
      type: "unknown",
      defaultValue: "8 * 1024 * 1024",
      description: "Largest file size accepted, in bytes; larger files are rejected with an inline error message.",
    },
    {
      name: "file",
      kind: "model",
      required: false,
      type: "File | null",
      defaultValue: "null",
      description: "Selected file. Two-way bindable via `[(file)]`; `null` when nothing is selected.",
    },
  ],
};
