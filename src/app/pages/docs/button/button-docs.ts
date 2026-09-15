import { Component } from '@angular/core';
import { LucideHeart, LucideDownload } from '@lucide/angular';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Button } from '../../../registry/button/button';
import { buttonApi } from '../../../registry/button/button.api';

@Component({
  selector: 'docs-button',
  imports: [Button, ApiTable, CodeTabs],
  templateUrl: './button-docs.html',
})
export default class ButtonDocs {
  protected readonly heartIcon = LucideHeart;
  protected readonly downloadIcon = LucideDownload;
  protected readonly api = buttonApi;

  protected readonly variantsHtml = `<ui-button variant="primary">Primary</ui-button>
<ui-button variant="secondary">Secondary</ui-button>
<ui-button variant="tertiary">Tertiary</ui-button>
<ui-button variant="icon" [icon]="heartIcon" ariaLabel="Like"></ui-button>`;

  protected readonly variantsTs = `import { Component } from '@angular/core';
import { LucideHeart } from '@lucide/angular';
import { Button } from './ui/button/button';

@Component({
  selector: 'app-button-variants',
  imports: [Button],
  templateUrl: './button-variants.html',
})
export class ButtonVariants {
  heartIcon = LucideHeart;
}`;

  protected readonly statesHtml = `<ui-button [disabled]="true">Disabled</ui-button>
<ui-button [loading]="true">Loading</ui-button>
<ui-button [icon]="downloadIcon" iconPos="left">With icon</ui-button>`;

  protected readonly statesTs = `import { Component } from '@angular/core';
import { LucideDownload } from '@lucide/angular';
import { Button } from './ui/button/button';

@Component({
  selector: 'app-button-states',
  imports: [Button],
  templateUrl: './button-states.html',
})
export class ButtonStates {
  downloadIcon = LucideDownload;
}`;

  protected readonly sizesHtml = `<ui-button size="sm">Small</ui-button>
<ui-button size="md">Medium</ui-button>
<ui-button size="default">Default</ui-button>
<ui-button size="xl">Extra large</ui-button>`;

  protected readonly sizesTs = `import { Component } from '@angular/core';
import { Button } from './ui/button/button';

@Component({
  selector: 'app-button-sizes',
  imports: [Button],
  templateUrl: './button-sizes.html',
})
export class ButtonSizes {}`;

  protected readonly inverseHtml = `<div class="bg-neutral-500 p-4 rounded">
  <ui-button [inverse]="true">Primary</ui-button>
  <ui-button variant="secondary" [inverse]="true">Secondary</ui-button>
  <ui-button variant="tertiary" [inverse]="true">Tertiary</ui-button>
</div>`;

  protected readonly inverseTs = `import { Component } from '@angular/core';
import { Button } from './ui/button/button';

@Component({
  selector: 'app-button-inverse',
  imports: [Button],
  templateUrl: './button-inverse.html',
})
export class ButtonInverse {}`;
}
