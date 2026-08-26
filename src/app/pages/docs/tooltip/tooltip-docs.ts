import { Component } from '@angular/core';
import { TooltipDirective } from '../../../registry/tooltip/tooltip.directive';
import { tooltipDirectiveApi } from '../../../registry/tooltip/tooltip.directive.api';
import { tooltipApi } from '../../../registry/tooltip/tooltip.api';
import { ApiTable } from '../../../docs-ui/api-table/api-table';

@Component({
  selector: 'docs-tooltip',
  imports: [TooltipDirective, ApiTable],
  templateUrl: './tooltip-docs.html',
})
export default class TooltipDocs {
  protected readonly api = tooltipApi;
  protected readonly directiveApi = tooltipDirectiveApi;
}
