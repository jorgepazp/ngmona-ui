import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Spinner } from '../../../registry/spinner/spinner';
import { spinnerApi } from '../../../registry/spinner/spinner.api';

@Component({
  selector: 'docs-spinner',
  imports: [Spinner, ApiTable, CodeTabs],
  templateUrl: './spinner-docs.html',
})
export default class SpinnerDocs {
  protected readonly api = spinnerApi;

  protected readonly sizesHtml = `<ui-spinner [size]="24"></ui-spinner>
<ui-spinner [size]="36"></ui-spinner>
<ui-spinner [size]="52"></ui-spinner>`;

  protected readonly sizesTs = `import { Component } from '@angular/core';
import { Spinner } from './ui/spinner/spinner';

@Component({
  selector: 'app-spinner-sizes',
  imports: [Spinner],
  templateUrl: './spinner-sizes.html',
})
export class SpinnerSizes {}`;

  protected readonly colorHtml = `<ui-spinner [size]="36" classNames="text-primary-500"></ui-spinner>
<ui-spinner [size]="36" classNames="text-accent-500"></ui-spinner>
<ui-spinner [size]="36" classNames="text-neutral-300"></ui-spinner>`;

  protected readonly colorTs = `import { Component } from '@angular/core';
import { Spinner } from './ui/spinner/spinner';

@Component({
  selector: 'app-spinner-colors',
  imports: [Spinner],
  templateUrl: './spinner-colors.html',
})
export class SpinnerColors {}`;

  protected readonly labelHtml = `<ui-spinner [size]="36" ariaLabel="Saving changes"></ui-spinner>`;

  protected readonly labelTs = `import { Component } from '@angular/core';
import { Spinner } from './ui/spinner/spinner';

@Component({
  selector: 'app-saving-spinner',
  imports: [Spinner],
  templateUrl: './saving-spinner.html',
})
export class SavingSpinner {}`;
}
