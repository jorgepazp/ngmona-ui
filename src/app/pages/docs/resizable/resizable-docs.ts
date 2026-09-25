import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Resizable } from '../../../registry/resizable/resizable';
import { resizableApi } from '../../../registry/resizable/resizable.api';
import { ResizablePaneDirective } from '../../../registry/resizable/resizable-pane.directive';

@Component({
  selector: 'docs-resizable',
  imports: [Resizable, ResizablePaneDirective, ApiTable, CodeTabs],
  templateUrl: './resizable-docs.html',
})
export default class ResizableDocs {
  protected readonly api = resizableApi;

  protected readonly horizontalHtml = `<ui-resizable direction="horizontal" classNames="h-128">
  <div uiResizablePane [defaultSize]="30" [minSize]="15">Sidebar</div>
  <div uiResizablePane [defaultSize]="70" [minSize]="30">Main content</div>
</ui-resizable>`;

  protected readonly horizontalTs = `import { Component } from '@angular/core';
import { Resizable } from './ui/resizable/resizable';
import { ResizablePaneDirective } from './ui/resizable/resizable-pane.directive';

@Component({
  selector: 'app-split-view',
  imports: [Resizable, ResizablePaneDirective],
  templateUrl: './split-view.html',
})
export class SplitView {}`;

  protected readonly verticalHtml = `<ui-resizable direction="vertical" classNames="h-192">
  <div uiResizablePane [minSize]="10">Header</div>
  <div uiResizablePane [minSize]="20">Body</div>
  <div uiResizablePane [minSize]="10">Footer</div>
</ui-resizable>`;

  protected readonly verticalTs = `import { Component } from '@angular/core';
import { Resizable } from './ui/resizable/resizable';
import { ResizablePaneDirective } from './ui/resizable/resizable-pane.directive';

@Component({
  selector: 'app-stacked-panes',
  imports: [Resizable, ResizablePaneDirective],
  templateUrl: './stacked-panes.html',
})
export class StackedPanes {}`;
}
