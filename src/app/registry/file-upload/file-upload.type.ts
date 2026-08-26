/**
 * Extension key (without the leading dot). Widened with `string & {}` so arbitrary extensions are
 * still accepted (and get a generic `.ext` accept-attribute fallback) while the common ones still
 * autocomplete.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type FileUploadExtension = 'jpg' | 'jpeg' | 'png' | 'pdf' | (string & {});

/** MIME type for each recognized extension, used to build the file input's `accept` attribute. */
export const FILE_UPLOAD_MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  pdf: 'application/pdf',
};

/** Sensible default whitelist — overridable via the `extensions` input, never the only option. */
export const DEFAULT_FILE_UPLOAD_EXTENSIONS: FileUploadExtension[] = ['jpg', 'jpeg', 'png', 'pdf'];
