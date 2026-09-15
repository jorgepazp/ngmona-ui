import { Component } from '@angular/core';
import { Card } from '../../../registry/card/card';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { cardApi } from '../../../registry/card/card.api';

@Component({
  selector: 'docs-card',
  imports: [Card, ApiTable, CodeTabs],
  templateUrl: './card-docs.html',
})
export default class CardDocs {
  protected readonly api = cardApi;

  protected readonly shadowHtml = `<ui-card shadow="hover">
  <p>Hover (default)</p>
  <p>Shadow appears on hover.</p>
</ui-card>
<ui-card shadow="always">
  <p>Always</p>
  <p>Shadow is always visible.</p>
</ui-card>
<ui-card shadow="none">
  <p>None</p>
  <p>No shadow at all.</p>
</ui-card>`;

  protected readonly shadowTs = `import { Component } from '@angular/core';
import { Card } from './ui/card/card';

@Component({
  selector: 'app-card-shadows',
  imports: [Card],
  templateUrl: './card-shadows.html',
})
export class CardShadows {}`;

  protected readonly classNamesHtml = `<ui-card classNames="max-w-xs bg-surface-light">
  <p>classNames lets you extend or override layout/spacing.</p>
</ui-card>`;

  protected readonly classNamesTs = `import { Component } from '@angular/core';
import { Card } from './ui/card/card';

@Component({
  selector: 'app-custom-card',
  imports: [Card],
  templateUrl: './custom-card.html',
})
export class CustomCard {}`;
}
