import { Component, signal } from '@angular/core';
import { FileUpload } from '../../../registry/file-upload/file-upload';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { fileUploadApi } from '../../../registry/file-upload/file-upload.api';

@Component({
  selector: 'docs-file-upload',
  imports: [FileUpload, ApiTable],
  templateUrl: './file-upload-docs.html',
})
export default class FileUploadDocs {
  protected readonly file = signal<File | null>(null);
  protected readonly api = fileUploadApi;
}
