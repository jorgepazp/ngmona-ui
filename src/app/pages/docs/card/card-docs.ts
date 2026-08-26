import { Component } from '@angular/core';
import { Card } from '../../../registry/card/card';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { cardApi } from '../../../registry/card/card.api';

@Component({
  selector: 'docs-card',
  imports: [Card, ApiTable],
  templateUrl: './card-docs.html',
})
export default class CardDocs {
  protected readonly api = cardApi;
}
