import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Accordion } from '../../../registry/accordion/accordion';
import { accordionApi } from '../../../registry/accordion/accordion.api';
import { AccordionItem } from '../../../registry/accordion/accordion-item/accordion-item';
import { accordionItemApi } from '../../../registry/accordion/accordion-item/accordion-item.api';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';

@Component({
  selector: 'docs-accordion',
  imports: [Accordion, AccordionItem, UiTemplateDirective, ApiTable],
  templateUrl: './accordion-docs.html',
})
export default class AccordionDocs {
  protected readonly api = accordionApi;
  protected readonly itemApi = accordionItemApi;
}
