import { Component, signal } from '@angular/core';
import { FileUpload } from '../../../registry/file-upload/file-upload';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { fileUploadApi } from '../../../registry/file-upload/file-upload.api';

@Component({
  selector: 'docs-file-upload',
  imports: [FileUpload, ApiTable, CodeTabs],
  templateUrl: './file-upload-docs.html',
})
export default class FileUploadDocs {
  protected readonly file = signal<File | null>(null);
  protected readonly api = fileUploadApi;

  protected readonly bindingHtml = `<ui-file-upload [(file)]="file"></ui-file-upload>
<p>file = {{ file()?.name ?? 'none' }}</p>`;

  protected readonly bindingTs = `import { Component, signal } from '@angular/core';
import { FileUpload } from './ui/file-upload/file-upload';

@Component({
  selector: 'app-avatar-upload',
  imports: [FileUpload],
  templateUrl: './avatar-upload.html',
})
export class AvatarUpload {
  file = signal<File | null>(null);
}`;

  protected readonly customHtml = `<ui-file-upload [extensions]="['csv', 'xlsx']" [maxFileSizeBytes]="2 * 1024 * 1024"></ui-file-upload>`;

  protected readonly customTs = `import { Component } from '@angular/core';
import { FileUpload } from './ui/file-upload/file-upload';

@Component({
  selector: 'app-spreadsheet-upload',
  imports: [FileUpload],
  templateUrl: './spreadsheet-upload.html',
})
export class SpreadsheetUpload {}`;

  protected readonly loadingHtml = `<ui-file-upload [loading]="true"></ui-file-upload>`;

  protected readonly loadingTs = `import { Component } from '@angular/core';
import { FileUpload } from './ui/file-upload/file-upload';

@Component({
  selector: 'app-uploading-file',
  imports: [FileUpload],
  templateUrl: './uploading-file.html',
})
export class UploadingFile {}`;

  protected readonly disabledHtml = `<ui-file-upload [disabled]="true"></ui-file-upload>`;

  protected readonly disabledTs = `import { Component } from '@angular/core';
import { FileUpload } from './ui/file-upload/file-upload';

@Component({
  selector: 'app-disabled-upload',
  imports: [FileUpload],
  templateUrl: './disabled-upload.html',
})
export class DisabledUpload {}`;
}
