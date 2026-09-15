// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const fileUploadApi: ComponentApiDoc = {
  name: "FileUpload",
  description: "Single-file drop zone backed by a native `<input type=\"file\">`. Supports clicking, dragging a file onto it, or focusing it and pressing Enter or Space. Restrict accepted files with `extensions`; files with a different extension or larger than `maxFileSizeBytes` are rejected with an inline error message. Set `loading` to show a spinner while your own upload request is in flight. The component only handles file selection; it does not perform the upload itself.",
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
