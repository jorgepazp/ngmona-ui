import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Slider } from '../../../registry/slider/slider';
import { sliderApi } from '../../../registry/slider/slider.api';

@Component({
  selector: 'docs-slider',
  imports: [Slider, ApiTable],
  templateUrl: './slider-docs.html',
})
export default class SliderDocs {
  protected readonly volume = signal(40);
  protected readonly price = signal(250);

  protected readonly formatPrice = (value: number) => `$${value}`;
  protected readonly api = sliderApi;
}
