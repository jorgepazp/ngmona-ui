import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { RadioGroup } from '../../../registry/radio-group/radio-group';
import { radioGroupApi } from '../../../registry/radio-group/radio-group.api';

@Component({
  selector: 'docs-radio-group',
  imports: [RadioGroup, FormsModule, ApiTable, CodeTabs],
  templateUrl: './radio-group-docs.html',
})
export default class RadioGroupDocs {
  protected fruit: string | undefined;
  protected fruits: string[] = [];
  protected readonly options = ['Apple', 'Banana', 'Cherry', 'Durian'];
  protected readonly pagedOptions = ['Apple', 'Banana', 'Cherry', 'Durian', 'Elderberry', 'Fig'];
  protected readonly api = radioGroupApi;

  protected readonly listHtml = `<ui-radio-group [options]="options" [(ngModel)]="fruit" ariaLabel="Fruit"></ui-radio-group>
<p>selected = {{ fruit }}</p>`;

  protected readonly listTs = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioGroup } from './ui/radio-group/radio-group';

@Component({
  selector: 'app-fruit-list',
  imports: [RadioGroup, FormsModule],
  templateUrl: './fruit-list.html',
})
export class FruitList {
  fruit: string | undefined;
  options = ['Apple', 'Banana', 'Cherry', 'Durian'];
}`;

  protected readonly chipsHtml = `<ui-radio-group [options]="options" type="chips" [(ngModel)]="fruit" ariaLabel="Fruit"></ui-radio-group>`;

  protected readonly chipsTs = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioGroup } from './ui/radio-group/radio-group';

@Component({
  selector: 'app-fruit-chips',
  imports: [RadioGroup, FormsModule],
  templateUrl: './fruit-chips.html',
})
export class FruitChips {
  fruit: string | undefined;
  options = ['Apple', 'Banana', 'Cherry', 'Durian'];
}`;

  protected readonly multipleHtml = `<ui-radio-group [options]="options" [multiple]="true" [(ngModel)]="fruits" ariaLabel="Fruits"></ui-radio-group>
<p>selected = {{ fruits }}</p>`;

  protected readonly multipleTs = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioGroup } from './ui/radio-group/radio-group';

@Component({
  selector: 'app-fruit-multiselect',
  imports: [RadioGroup, FormsModule],
  templateUrl: './fruit-multiselect.html',
})
export class FruitMultiselect {
  fruits: string[] = [];
  options = ['Apple', 'Banana', 'Cherry', 'Durian'];
}`;

  protected readonly paginatedHtml = `<ui-radio-group
  [options]="pagedOptions"
  [paginator]="true"
  [pageSize]="2"
  [(ngModel)]="fruit"
  ariaLabel="Fruit"
></ui-radio-group>`;

  protected readonly paginatedTs = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioGroup } from './ui/radio-group/radio-group';

@Component({
  selector: 'app-fruit-paginated',
  imports: [RadioGroup, FormsModule],
  templateUrl: './fruit-paginated.html',
})
export class FruitPaginated {
  fruit: string | undefined;
  pagedOptions = ['Apple', 'Banana', 'Cherry', 'Durian', 'Elderberry', 'Fig'];
}`;
}
