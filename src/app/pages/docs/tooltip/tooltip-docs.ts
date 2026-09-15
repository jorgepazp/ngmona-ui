import { Component } from '@angular/core';
import { TooltipDirective } from '../../../registry/tooltip/tooltip.directive';
import { tooltipDirectiveApi } from '../../../registry/tooltip/tooltip.directive.api';
import { tooltipApi } from '../../../registry/tooltip/tooltip.api';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';

@Component({
  selector: 'docs-tooltip',
  imports: [TooltipDirective, ApiTable, CodeTabs],
  templateUrl: './tooltip-docs.html',
})
export default class TooltipDocs {
  protected readonly api = tooltipApi;
  protected readonly directiveApi = tooltipDirectiveApi;

  protected readonly basicHtml = `<button type="button" uiTooltip="Tooltip below" position="below">Hover me</button>`;

  protected readonly basicTs = `import { Component } from '@angular/core';
import { TooltipDirective } from './ui/tooltip/tooltip.directive';

@Component({
  selector: 'app-hint-button',
  imports: [TooltipDirective],
  templateUrl: './hint-button.html',
})
export class HintButton {}`;

  protected readonly headingHtml = `<button
  type="button"
  uiTooltip="Titles help scan longer tooltip content."
  heading="Did you know?"
  position="below"
>
  Hover me
</button>`;

  protected readonly headingTs = `import { Component } from '@angular/core';
import { TooltipDirective } from './ui/tooltip/tooltip.directive';

@Component({
  selector: 'app-tip-button',
  imports: [TooltipDirective],
  templateUrl: './tip-button.html',
})
export class TipButton {}`;
}
