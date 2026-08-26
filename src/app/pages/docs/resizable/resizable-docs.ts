import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Resizable } from '../../../registry/resizable/resizable';
import { resizableApi } from '../../../registry/resizable/resizable.api';
import { ResizablePaneDirective } from '../../../registry/resizable/resizable-pane.directive';

@Component({
  selector: 'docs-resizable',
  imports: [Resizable, ResizablePaneDirective, ApiTable],
  templateUrl: './resizable-docs.html',
})
export default class ResizableDocs {
  protected readonly api = resizableApi;
}
