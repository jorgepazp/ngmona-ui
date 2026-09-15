import { Component, computed, input, model, signal } from '@angular/core';
import { LucideUpload, LucideCheckCircle2, LucideX, LucideLoaderCircle } from '@lucide/angular';
import {
  DEFAULT_FILE_UPLOAD_EXTENSIONS,
  FILE_UPLOAD_MIME_TYPES,
  type FileUploadExtension,
} from './file-upload.type';

let nextId = 0;

/**
 * Single-file drop zone backed by a native `<input type="file">`. Supports clicking, dragging a
 * file onto it, or focusing it and pressing Enter or Space.
 *
 * Restrict accepted files with `extensions`; files with a different extension or larger than
 * `maxFileSizeBytes` are rejected with an inline error message. Set `loading` to show a spinner
 * while your own upload request is in flight. The component only handles file selection; it does
 * not perform the upload itself.
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
