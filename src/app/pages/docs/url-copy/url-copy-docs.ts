import { Component, signal } from '@angular/core';
import { UrlCopy } from '../../../registry/url-copy/url-copy';
import { urlCopyApi } from '../../../registry/url-copy/url-copy.api';
import { ApiTable } from '../../../docs-ui/api-table/api-table';

@Component({
  selector: 'docs-url-copy',
  imports: [UrlCopy, ApiTable],
  templateUrl: './url-copy-docs.html',
})
export default class UrlCopyDocs {
  protected readonly copyCount = signal(0);
  protected readonly api = urlCopyApi;
}
