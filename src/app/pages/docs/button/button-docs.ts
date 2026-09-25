import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideArrowRight,
  LucideCheck,
  LucideChevronDown,
  LucideChevronUp,
  LucideDownload,
  LucideDynamicIcon,
  LucideHeart,
  LucidePlus,
  LucideTrash2,
} from '@lucide/angular';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Button } from '../../../registry/button/button';
import { buttonApi } from '../../../registry/button/button.api';
import { TooltipDirective } from '../../../registry/tooltip/tooltip.directive';

@Component({
  selector: 'docs-button',
  imports: [Button, ApiTable, CodeTabs, RouterLink, TooltipDirective, LucideDynamicIcon],
  templateUrl: './button-docs.html',
})
export default class ButtonDocs {
  protected readonly heartIcon = LucideHeart;
  protected readonly downloadIcon = LucideDownload;
  protected readonly trashIcon = LucideTrash2;
  protected readonly plusIcon = LucidePlus;
  protected readonly checkIcon = LucideCheck;
  protected readonly arrowIcon = LucideArrowRight;
  protected readonly chevronUpIcon = LucideChevronUp;
  protected readonly chevronDownIcon = LucideChevronDown;
  protected readonly expanded = signal(false);
  protected readonly api = buttonApi;

  protected readonly colorsHtml = `<button uiButton color="danger">Delete</button>
<button uiButton color="success">Approve</button>
<button uiButton color="warning">Retry</button>
<button uiButton color="info">Details</button>
<button uiButton color="surface">Cancel</button>

<button uiButton variant="secondary" color="danger">Delete</button>
<button uiButton variant="tertiary" color="danger">Delete</button>
<button uiButton variant="icon" color="danger" [icon]="trashIcon" aria-label="Delete"></button>
<button uiButton variant="icon" color="success" [icon]="checkIcon" aria-label="Approve"></button>
<button uiButton variant="icon" color="surface" [icon]="plusIcon" aria-label="Add"></button>`;

  protected readonly pillHtml = `<button uiButton shape="pill">Follow</button>
<button uiButton shape="pill" variant="secondary" [icon]="plusIcon" iconPos="left">Add tag</button>`;

  protected readonly linksHtml = `<a uiButton routerLink="/guides/installation">Get started</a>
<a uiButton variant="secondary" routerLink="/components/badge" [icon]="arrowIcon">Badge docs</a>
<a uiButton variant="tertiary" routerLink="/" [disabled]="true">Disabled link</a>`;

  protected readonly labelsHtml = `<!-- The tooltip text becomes the accessible name -->
<button uiButton variant="icon" [icon]="trashIcon" uiTooltip="Delete" position="above"></button>

<!-- No tooltip: name it explicitly -->
<button uiButton variant="icon" [icon]="heartIcon" aria-label="Add to favorites"></button>`;

  protected readonly customHtml = `<button uiButton variant="secondary" [style.min-width.px]="180" type="submit">
  <svg [lucideIcon]="expanded() ? chevronUpIcon : chevronDownIcon" [size]="16" aria-hidden="true"></svg>
  {{ expanded() ? 'Collapse' : 'Expand' }}
</button>`;

  protected readonly variantsHtml = `<button uiButton variant="primary">Primary</button>
<button uiButton variant="secondary">Secondary</button>
<button uiButton variant="tertiary">Tertiary</button>
<button uiButton variant="icon" [icon]="heartIcon" aria-label="Like"></button>`;

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

  protected readonly statesHtml = `<button uiButton [disabled]="true">Disabled</button>
<button uiButton [loading]="true">Loading</button>
<button uiButton [icon]="downloadIcon" iconPos="left">With icon</button>`;

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

  protected readonly sizesHtml = `<button uiButton size="sm">Small</button>
<button uiButton size="md">Medium</button>
<button uiButton size="default">Default</button>
<button uiButton size="xl">Extra large</button>`;

  protected readonly sizesTs = `import { Component } from '@angular/core';
import { Button } from './ui/button/button';

@Component({
  selector: 'app-button-sizes',
  imports: [Button],
  templateUrl: './button-sizes.html',
})
export class ButtonSizes {}`;

  protected readonly inverseHtml = `<div class="bg-neutral-500 p-8 rounded">
  <button uiButton [inverse]="true">Primary</button>
  <button uiButton variant="secondary" [inverse]="true">Secondary</button>
  <button uiButton variant="tertiary" [inverse]="true">Tertiary</button>
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
