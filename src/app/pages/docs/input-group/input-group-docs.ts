import { Component } from '@angular/core';
import { LucideDynamicIcon, LucideSearch } from '@lucide/angular';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Button } from '../../../registry/button/button';
import { InputGroup } from '../../../registry/input-group/input-group';
import { inputGroupApi } from '../../../registry/input-group/input-group.api';

@Component({
  selector: 'docs-input-group',
  imports: [InputGroup, Button, LucideDynamicIcon, ApiTable, CodeTabs],
  templateUrl: './input-group-docs.html',
})
export default class InputGroupDocs {
  protected readonly searchIcon = LucideSearch;
  protected readonly api = inputGroupApi;

  protected readonly amountHtml = `<ui-input-group>
  <span prefix>$</span>
  <input class="flex-1 min-w-0 border-none outline-none bg-transparent" placeholder="0.00" />
  <span suffix>USD</span>
</ui-input-group>`;

  protected readonly amountTs = `import { Component } from '@angular/core';
import { InputGroup } from './ui/input-group/input-group';

@Component({
  selector: 'app-amount-field',
  imports: [InputGroup],
  templateUrl: './amount-field.html',
})
export class AmountField {}`;

  protected readonly searchHtml = `<ui-input-group>
  <span prefix>
    <svg [lucideIcon]="searchIcon" [size]="16"></svg>
  </span>
  <input class="flex-1 min-w-0 border-none outline-none bg-transparent" placeholder="Search..." />
  <ui-button suffix variant="primary" size="sm">Go</ui-button>
</ui-input-group>`;

  protected readonly searchTs = `import { Component } from '@angular/core';
import { LucideDynamicIcon, LucideSearch } from '@lucide/angular';
import { Button } from './ui/button/button';
import { InputGroup } from './ui/input-group/input-group';

@Component({
  selector: 'app-search-field',
  imports: [InputGroup, Button, LucideDynamicIcon],
  templateUrl: './search-field.html',
})
export class SearchField {
  searchIcon = LucideSearch;
}`;

  protected readonly statesHtml = `<ui-input-group state="error">
  <span prefix>#</span>
  <input class="flex-1 min-w-0 border-none outline-none bg-transparent" value="not-a-number" />
</ui-input-group>

<ui-input-group [disabled]="true">
  <span prefix>$</span>
  <input class="flex-1 min-w-0 border-none outline-none bg-transparent" placeholder="Disabled" disabled />
</ui-input-group>`;

  protected readonly statesTs = `import { Component } from '@angular/core';
import { InputGroup } from './ui/input-group/input-group';

@Component({
  selector: 'app-input-group-states',
  imports: [InputGroup],
  templateUrl: './input-group-states.html',
})
export class InputGroupStates {}`;
}
