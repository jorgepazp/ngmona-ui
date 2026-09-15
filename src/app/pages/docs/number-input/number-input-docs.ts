import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { NumberInput } from '../../../registry/number-input/number-input';
import { numberInputApi } from '../../../registry/number-input/number-input.api';

@Component({
  selector: 'docs-number-input',
  imports: [NumberInput, ApiTable, CodeTabs],
  templateUrl: './number-input-docs.html',
})
export default class NumberInputDocs {
  protected readonly quantity = signal(1);
  protected readonly api = numberInputApi;

  protected readonly bindingHtml = `<ui-number-input label="Quantity" [min]="0" [max]="10" [(value)]="quantity"></ui-number-input>
<p>quantity = {{ quantity() }}</p>`;

  protected readonly bindingTs = `import { Component, signal } from '@angular/core';
import { NumberInput } from './ui/number-input/number-input';

@Component({
  selector: 'app-quantity-field',
  imports: [NumberInput],
  templateUrl: './quantity-field.html',
})
export class QuantityField {
  quantity = signal(1);
}`;

  protected readonly stepHtml = `<ui-number-input label="Step of 5" [min]="0" [max]="100" [step]="5" [value]="10"></ui-number-input>`;

  protected readonly stepTs = `import { Component } from '@angular/core';
import { NumberInput } from './ui/number-input/number-input';

@Component({
  selector: 'app-stepped-input',
  imports: [NumberInput],
  templateUrl: './stepped-input.html',
})
export class SteppedInput {}`;

  protected readonly statesHtml = `<ui-number-input label="Success" state="success" caption="Looks good" [value]="3"></ui-number-input>
<ui-number-input label="Error" state="error" caption="Must be at least 1" [value]="0" [min]="1"></ui-number-input>
<ui-number-input label="Disabled" [disabled]="true" [value]="2"></ui-number-input>`;

  protected readonly statesTs = `import { Component } from '@angular/core';
import { NumberInput } from './ui/number-input/number-input';

@Component({
  selector: 'app-number-input-states',
  imports: [NumberInput],
  templateUrl: './number-input-states.html',
})
export class NumberInputStates {}`;
}
