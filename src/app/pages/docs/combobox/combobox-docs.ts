import { Component, computed, signal } from '@angular/core';
import { Combobox } from '../../../registry/combobox/combobox';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { comboboxApi } from '../../../registry/combobox/combobox.api';

@Component({
  selector: 'docs-combobox',
  imports: [Combobox, ApiTable, CodeTabs],
  templateUrl: './combobox-docs.html',
})
export default class ComboboxDocs {
  protected readonly api = comboboxApi;
  protected readonly fruits = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Dragonfruit', value: 'dragonfruit' },
    { label: 'Grape', value: 'grape' },
    { label: 'Kiwi', value: 'kiwi' },
    { label: 'Lemon', value: 'lemon' },
    { label: 'Mango', value: 'mango' },
    { label: 'Orange', value: 'orange' },
    { label: 'Peach', value: 'peach', disabled: true },
    { label: 'Strawberry', value: 'strawberry' },
    { label: 'Watermelon', value: 'watermelon' },
  ];

  protected readonly fruit = signal<unknown>(undefined);
  protected readonly fruitLabel = computed(() => (this.fruit() as { label: string } | undefined)?.label ?? '(none)');

  protected readonly basicHtml = `<ui-combobox
  [options]="fruits"
  [(value)]="fruit"
  placeholder="Search fruit…"
  label="Fruit"
></ui-combobox>
<p>value = {{ fruitLabel() }}</p>`;

  protected readonly basicTs = `import { Component, computed, signal } from '@angular/core';
import { Combobox } from './ui/combobox/combobox';

@Component({
  selector: 'app-fruit-picker',
  imports: [Combobox],
  templateUrl: './fruit-picker.html',
})
export class FruitPicker {
  fruits = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Peach', value: 'peach', disabled: true },
    // ...
  ];

  fruit = signal<unknown>(undefined);
  fruitLabel = computed(() => (this.fruit() as { label: string } | undefined)?.label ?? '(none)');
}`;
}
