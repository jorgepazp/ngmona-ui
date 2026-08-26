import { Component, computed, input, model, signal } from '@angular/core';
import { LucideUpload, LucideCheckCircle2, LucideX, LucideLoaderCircle } from '@lucide/angular';
import {
  DEFAULT_FILE_UPLOAD_EXTENSIONS,
  FILE_UPLOAD_MIME_TYPES,
  type FileUploadExtension,
} from './file-upload.type';

let nextId = 0;

/**
 * Single-file drop zone with a real `<input type="file">` underneath — clicking, dragging a file
 * onto it, or tabbing to it and pressing Enter/Space all work. The original hid the input with
 * `class="hidden"` (`display: none`, which also makes it unfocusable) behind a plain
 * `<div (click)>` with no `tabindex`/`role`, so keyboard-only users had no way to open the file
 * picker at all. Here the input is visually hidden with `sr-only` (stays focusable) and nested
 * inside a `<label>`, so native label-activates-control behavior provides full keyboard support
 * for free, with no custom key handling needed.
 *
 * Other fixes made while porting (the component was identical across both forks that had it):
 * - `maxFileSizeInMB` returned only the first character of the string `maxFileSize / 1024` —
 *   correct by coincidence for the 8 MB default, wrong for almost any other value (e.g. 12 MB
 *   rendered as "1 MB"). Replaced with `Math.round(maxFileSizeBytes / 1024 / 1024)`.
 * - The file picker's `accept` attribute was a hardcoded string, completely ignoring the
 *   `extensions` input — configuring `extensions` never changed what the OS file dialog offered.
 *   It's now derived from `extensions()`.
 * - Extension validation compared the browser-reported MIME subtype against the `extensions`
 *   list, so a configured `'jpg'` entry could never match (browsers always report `.jpg` files as
 *   MIME type `image/jpeg`, never `image/jpg`) — dead, unreachable config. Validation now checks
 *   the actual filename extension first, with MIME type as a secondary signal.
 * - Rejected files (wrong type, too large) silently did nothing — no feedback at all. Now surfaces
 *   a `role="alert"` message.
 * - Dropped the fake `rxjs` `delay(500)` "upload" — the component never actually uploaded
 *   anything over the network, so the spinner was simulating work that didn't exist. Selection is
 *   now synchronous; a `loading` input lets the caller show a spinner while *their* upload
 *   request is in flight.
 *
 * The default `jpg`/`jpeg`/`png`/`pdf` whitelist is kept as the default `extensions` value, not
 * hardcoded as the only option — pass a different array to accept other file types.
 */
@Component({
  selector: 'ui-file-upload',
  imports: [LucideUpload, LucideCheckCircle2, LucideX, LucideLoaderCircle],
  templateUrl: './file-upload.html',
})
export class FileUpload {
  /** DOM id for the underlying `<input type="file">`; auto-generated when omitted. */
  readonly id = input<string | undefined>(undefined);
  /** Disables the drop zone entirely — no click, drag/drop, or keyboard activation opens the file picker. */
  readonly disabled = input(false);
  /** Set by the caller while their own upload request is in flight. */
  readonly loading = input(false);
  /** Allowed file extensions (no leading dot), used both to build the file picker's `accept` filter and to validate the chosen/dropped file. */
  readonly extensions = input<FileUploadExtension[]>(DEFAULT_FILE_UPLOAD_EXTENSIONS);
  /** Largest file size accepted, in bytes; larger files are rejected with an inline error message. */
  readonly maxFileSizeBytes = input(8 * 1024 * 1024);

  /** Selected file. Two-way bindable via `[(file)]`; `null` when nothing is selected. */
  readonly file = model<File | null>(null);

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isDragOver = signal(false);

  protected readonly uploadIcon = LucideUpload;
  protected readonly checkIcon = LucideCheckCircle2;
  protected readonly removeIcon = LucideX;
  protected readonly loaderIcon = LucideLoaderCircle;

  private readonly fallbackId = `ui-file-upload-${nextId++}`;
  protected readonly inputId = computed(() => this.id() ?? this.fallbackId);

  protected readonly acceptAttr = computed(() =>
    this.extensions()
      .map((ext) => FILE_UPLOAD_MIME_TYPES[ext.toLowerCase()] ?? `.${ext.toLowerCase()}`)
      .join(','),
  );

  protected readonly extensionsLabel = computed(() =>
    this.extensions()
      .map((ext) => ext.toUpperCase())
      .join(', '),
  );

  protected readonly maxSizeLabel = computed(() => `${Math.round(this.maxFileSizeBytes() / 1024 / 1024)} MB`);

  protected labelClass(): string {
    if (this.disabled()) return 'border-neutral-500 opacity-60 !cursor-not-allowed';
    if (this.loading()) return 'border-neutral-500 !cursor-default';
    if (this.isDragOver()) return 'border-primary-500 bg-primary-100';
    return 'border-neutral-500 cursor-pointer hover:border-neutral-600';
  }

  private validate(candidate: File): string | null {
    const allowed = this.extensions().map((ext) => ext.toLowerCase());
    const fileExtension = candidate.name.split('.').pop()?.toLowerCase() ?? '';
    const mimeMatches = allowed.some((ext) => FILE_UPLOAD_MIME_TYPES[ext] === candidate.type);

    if (!allowed.includes(fileExtension) && !mimeMatches) {
      return `"${candidate.name}" is not an accepted file type. Allowed: ${this.extensionsLabel()}.`;
    }
    if (candidate.size > this.maxFileSizeBytes()) {
      return `"${candidate.name}" exceeds the ${this.maxSizeLabel()} size limit.`;
    }
    return null;
  }

  private handleFiles(fileList: FileList | null): void {
    const candidate = fileList?.[0];
    if (!candidate) return;

    const error = this.validate(candidate);
    if (error) {
      this.errorMessage.set(error);
      return;
    }
    this.errorMessage.set(null);
    this.file.set(candidate);
  }

  protected onInputChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    this.handleFiles(inputEl.files);
    inputEl.value = '';
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    if (this.disabled() || this.loading() || this.file()) return;
    this.handleFiles(event.dataTransfer?.files ?? null);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (this.disabled() || this.loading() || this.file()) return;
    this.isDragOver.set(true);
  }

  protected onDragLeave(): void {
    this.isDragOver.set(false);
  }

  protected remove(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.file.set(null);
    this.errorMessage.set(null);
  }
}
