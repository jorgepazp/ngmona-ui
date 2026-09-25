import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Accordion } from '../../../registry/accordion/accordion';
import { accordionApi } from '../../../registry/accordion/accordion.api';
import { AccordionItem } from '../../../registry/accordion/accordion-item/accordion-item';
import { accordionItemApi } from '../../../registry/accordion/accordion-item/accordion-item.api';
import { UiTemplateDirective } from '../../../registry/shared/ui-template.directive';

@Component({
  selector: 'docs-accordion',
  imports: [Accordion, AccordionItem, UiTemplateDirective, ApiTable, CodeTabs],
  templateUrl: './accordion-docs.html',
})
export default class AccordionDocs {
  protected readonly api = accordionApi;
  protected readonly itemApi = accordionItemApi;

  protected readonly singleHtml = `<ui-accordion>
  <ui-accordion-item value="shipping" heading="What are the shipping options?">
    We offer standard (3-5 business days) and express (1-2 business days) shipping on all orders.
  </ui-accordion-item>
  <ui-accordion-item value="returns" heading="What's your return policy?">
    Items can be returned within 30 days of delivery for a full refund.
  </ui-accordion-item>
  <ui-accordion-item value="support" heading="How do I contact support?" [disabled]="true">
    This item is disabled and can't be expanded.
  </ui-accordion-item>
</ui-accordion>`;

  protected readonly singleTs = `import { Component } from '@angular/core';
import { Accordion } from './ui/accordion/accordion';
import { AccordionItem } from './ui/accordion/accordion-item/accordion-item';

@Component({
  selector: 'app-faq',
  imports: [Accordion, AccordionItem],
  templateUrl: './faq.html',
})
export class Faq {}`;

  protected readonly multipleHtml = `<ui-accordion [multiple]="true">
  <ui-accordion-item value="a">
    <ng-template uiTemplate="header">
      <span class="font-extrabold">Custom header markup</span>
    </ng-template>
    Any content can go inside a header template, not just plain text.
  </ui-accordion-item>
  <ui-accordion-item value="b" heading="Second item">
    Both items can be open at once here.
  </ui-accordion-item>
</ui-accordion>`;

  protected readonly multipleTs = `import { Component } from '@angular/core';
import { Accordion } from './ui/accordion/accordion';
import { AccordionItem } from './ui/accordion/accordion-item/accordion-item';
import { UiTemplateDirective } from './ui/shared/ui-template.directive';

@Component({
  selector: 'app-faq-multi',
  imports: [Accordion, AccordionItem, UiTemplateDirective],
  templateUrl: './faq-multi.html',
})
export class FaqMulti {}`;
}
