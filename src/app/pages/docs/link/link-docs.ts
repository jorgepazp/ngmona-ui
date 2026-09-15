import { Component } from '@angular/core';
import { LucideArrowRight } from '@lucide/angular';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Link } from '../../../registry/link/link';
import { linkApi } from '../../../registry/link/link.api';

@Component({
  selector: 'docs-link',
  imports: [Link, ApiTable, CodeTabs],
  templateUrl: './link-docs.html',
})
export default class LinkDocs {
  protected readonly arrowIcon = LucideArrowRight;
  protected readonly api = linkApi;

  protected readonly underlineHtml = `<ui-link href="#">Hover (default)</ui-link>
<ui-link href="#" underline="always">Always</ui-link>
<ui-link href="#" underline="none">None</ui-link>`;

  protected readonly underlineTs = `import { Component } from '@angular/core';
import { Link } from './ui/link/link';

@Component({
  selector: 'app-link-underline',
  imports: [Link],
  templateUrl: './link-underline.html',
})
export class LinkUnderline {}`;

  protected readonly iconHtml = `<ui-link href="#" [icon]="arrowIcon" iconPos="right">Continue</ui-link>
<ui-link href="https://example.com" target="_blank">Opens in a new tab</ui-link>`;

  protected readonly iconTs = `import { Component } from '@angular/core';
import { LucideArrowRight } from '@lucide/angular';
import { Link } from './ui/link/link';

@Component({
  selector: 'app-link-with-icon',
  imports: [Link],
  templateUrl: './link-with-icon.html',
})
export class LinkWithIcon {
  arrowIcon = LucideArrowRight;
}`;

  protected readonly statesHtml = `<ui-link href="#" [disabled]="true">Disabled</ui-link>`;

  protected readonly statesTs = `import { Component } from '@angular/core';
import { Link } from './ui/link/link';

@Component({
  selector: 'app-link-states',
  imports: [Link],
  templateUrl: './link-states.html',
})
export class LinkStates {}`;
}
