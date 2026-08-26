import { Component, computed, signal } from '@angular/core';
import { Combobox } from '../../../registry/combobox/combobox';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { comboboxApi } from '../../../registry/combobox/combobox.api';

@Component({
  selector: 'docs-combobox',
  imports: [Combobox, ApiTable],
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
}
