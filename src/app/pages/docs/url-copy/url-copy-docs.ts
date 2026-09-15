import { Component, signal } from '@angular/core';
import { UrlCopy } from '../../../registry/url-copy/url-copy';
import { urlCopyApi } from '../../../registry/url-copy/url-copy.api';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';

@Component({
  selector: 'docs-url-copy',
  imports: [UrlCopy, ApiTable, CodeTabs],
  templateUrl: './url-copy-docs.html',
})
export default class UrlCopyDocs {
  protected readonly copyCount = signal(0);
  protected readonly api = urlCopyApi;

  protected readonly basicHtml = `<ui-url-copy url="https://example.com/contract/sample"></ui-url-copy>`;

  protected readonly basicTs = `import { Component } from '@angular/core';
import { UrlCopy } from './ui/url-copy/url-copy';

@Component({
  selector: 'app-contract-link',
  imports: [UrlCopy],
  templateUrl: './contract-link.html',
})
export class ContractLink {}`;

  protected readonly customLabelsHtml = `<ui-url-copy url="https://example.com/invite/abc123" label="Copy invite link" copiedLabel="Link copied!"></ui-url-copy>`;

  protected readonly customLabelsTs = `import { Component } from '@angular/core';
import { UrlCopy } from './ui/url-copy/url-copy';

@Component({
  selector: 'app-invite-link',
  imports: [UrlCopy],
  templateUrl: './invite-link.html',
})
export class InviteLink {}`;

  protected readonly copiedOutputHtml = `<ui-url-copy url="https://example.com/share/xyz" (copied)="copyCount.set(copyCount() + 1)"></ui-url-copy>
<p>copied {{ copyCount() }} time(s)</p>`;

  protected readonly copiedOutputTs = `import { Component, signal } from '@angular/core';
import { UrlCopy } from './ui/url-copy/url-copy';

@Component({
  selector: 'app-share-link',
  imports: [UrlCopy],
  templateUrl: './share-link.html',
})
export class ShareLink {
  copyCount = signal(0);
}`;
}
