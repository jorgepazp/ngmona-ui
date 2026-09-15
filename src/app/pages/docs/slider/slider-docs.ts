import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Slider } from '../../../registry/slider/slider';
import { sliderApi } from '../../../registry/slider/slider.api';

@Component({
  selector: 'docs-slider',
  imports: [Slider, ApiTable, CodeTabs],
  templateUrl: './slider-docs.html',
})
export default class SliderDocs {
  protected readonly volume = signal(40);
  protected readonly price = signal(250);

  protected readonly formatPrice = (value: number) => `$${value}`;
  protected readonly api = sliderApi;

  protected readonly bindingHtml = `<ui-slider label="Volume" [(value)]="volume"></ui-slider>
<p>volume = {{ volume() }}</p>`;

  protected readonly bindingTs = `import { Component, signal } from '@angular/core';
import { Slider } from './ui/slider/slider';

@Component({
  selector: 'app-volume-slider',
  imports: [Slider],
  templateUrl: './volume-slider.html',
})
export class VolumeSlider {
  volume = signal(40);
}`;

  protected readonly rangeHtml = `<ui-slider label="Rating" [min]="0" [max]="10" [step]="1" [value]="6"></ui-slider>`;

  protected readonly rangeTs = `import { Component } from '@angular/core';
import { Slider } from './ui/slider/slider';

@Component({
  selector: 'app-rating-slider',
  imports: [Slider],
  templateUrl: './rating-slider.html',
})
export class RatingSlider {}`;

  protected readonly formattedHtml = `<ui-slider
  label="Max price"
  [min]="0"
  [max]="1000"
  [step]="10"
  [(value)]="price"
  [formatValue]="formatPrice"
  caption="Announced to screen readers as a dollar amount, not a raw number"
></ui-slider>`;

  protected readonly formattedTs = `import { Component, signal } from '@angular/core';
import { Slider } from './ui/slider/slider';

@Component({
  selector: 'app-price-slider',
  imports: [Slider],
  templateUrl: './price-slider.html',
})
export class PriceSlider {
  price = signal(250);
  formatPrice = (value: number) => \`$\${value}\`;
}`;

  protected readonly statesHtml = `<ui-slider label="No value badge" [showValue]="false" [value]="30"></ui-slider>
<ui-slider label="Disabled" [disabled]="true" [value]="55"></ui-slider>`;

  protected readonly statesTs = `import { Component } from '@angular/core';
import { Slider } from './ui/slider/slider';

@Component({
  selector: 'app-slider-states',
  imports: [Slider],
  templateUrl: './slider-states.html',
})
export class SliderStates {}`;
}
