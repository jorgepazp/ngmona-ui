import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Separator } from '../../../registry/separator/separator';
import { separatorApi } from '../../../registry/separator/separator.api';

@Component({
  selector: 'docs-separator',
  imports: [Separator, ApiTable, CodeTabs],
  templateUrl: './separator-docs.html',
})
export default class SeparatorDocs {
  protected readonly api = separatorApi;

  protected readonly horizontalHtml = `<p>Section one content.</p>
<ui-separator classNames="my-6"></ui-separator>
<p>Section two content.</p>`;

  protected readonly horizontalTs = `import { Component } from '@angular/core';
import { Separator } from './ui/separator/separator';

@Component({
  selector: 'app-sections',
  imports: [Separator],
  templateUrl: './sections.html',
})
export class Sections {}`;

  protected readonly verticalHtml = `<div class="flex items-center gap-6">
  <span>Profile</span>
  <ui-separator orientation="vertical"></ui-separator>
  <span>Settings</span>
  <ui-separator orientation="vertical"></ui-separator>
  <span>Logout</span>
</div>`;

  protected readonly verticalTs = `import { Component } from '@angular/core';
import { Separator } from './ui/separator/separator';

@Component({
  selector: 'app-nav-links',
  imports: [Separator],
  templateUrl: './nav-links.html',
})
export class NavLinks {}`;

  protected readonly semanticHtml = `<p>An article's content ends here.</p>
<ui-separator [decorative]="false" classNames="my-6"></ui-separator>
<p>Related articles begin below, meaningfully separated from the above.</p>`;

  protected readonly semanticTs = `import { Component } from '@angular/core';
import { Separator } from './ui/separator/separator';

@Component({
  selector: 'app-article',
  imports: [Separator],
  templateUrl: './article.html',
})
export class Article {}`;
}
