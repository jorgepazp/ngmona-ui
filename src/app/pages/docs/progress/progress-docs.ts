import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Progress } from '../../../registry/progress/progress';
import { progressApi } from '../../../registry/progress/progress.api';

@Component({
  selector: 'docs-progress',
  imports: [Progress, ApiTable, CodeTabs],
  templateUrl: './progress-docs.html',
})
export default class ProgressDocs {
  protected readonly api = progressApi;

  protected readonly valuesHtml = `<ui-progress [value]="25" ariaLabel="Upload progress"></ui-progress>
<ui-progress [value]="60" ariaLabel="Upload progress"></ui-progress>
<ui-progress [value]="100" ariaLabel="Upload progress"></ui-progress>`;

  protected readonly valuesTs = `import { Component } from '@angular/core';
import { Progress } from './ui/progress/progress';

@Component({
  selector: 'app-upload-progress',
  imports: [Progress],
  templateUrl: './upload-progress.html',
})
export class UploadProgress {}`;

  protected readonly indeterminateHtml = `<ui-progress ariaLabel="Loading"></ui-progress>`;

  protected readonly indeterminateTs = `import { Component } from '@angular/core';
import { Progress } from './ui/progress/progress';

@Component({
  selector: 'app-loading-progress',
  imports: [Progress],
  templateUrl: './loading-progress.html',
})
export class LoadingProgress {}`;

  protected readonly sizesHtml = `<ui-progress size="sm" [value]="45" ariaLabel="Progress"></ui-progress>
<ui-progress size="md" [value]="45" ariaLabel="Progress"></ui-progress>
<ui-progress size="lg" [value]="45" ariaLabel="Progress"></ui-progress>`;

  protected readonly sizesTs = `import { Component } from '@angular/core';
import { Progress } from './ui/progress/progress';

@Component({
  selector: 'app-progress-sizes',
  imports: [Progress],
  templateUrl: './progress-sizes.html',
})
export class ProgressSizes {}`;

  protected readonly variantsHtml = `<ui-progress variant="primary" [value]="70" ariaLabel="Progress"></ui-progress>
<ui-progress variant="success" [value]="70" ariaLabel="Progress"></ui-progress>
<ui-progress variant="warning" [value]="70" ariaLabel="Progress"></ui-progress>
<ui-progress variant="danger" [value]="70" ariaLabel="Progress"></ui-progress>
<ui-progress variant="info" [value]="70" ariaLabel="Progress"></ui-progress>`;

  protected readonly variantsTs = `import { Component } from '@angular/core';
import { Progress } from './ui/progress/progress';

@Component({
  selector: 'app-progress-variants',
  imports: [Progress],
  templateUrl: './progress-variants.html',
})
export class ProgressVariants {}`;

  protected readonly valueTextHtml = `<ui-progress [value]="3" [max]="5" valueText="3 of 5 steps complete" ariaLabel="Setup progress"></ui-progress>`;

  protected readonly valueTextTs = `import { Component } from '@angular/core';
import { Progress } from './ui/progress/progress';

@Component({
  selector: 'app-setup-progress',
  imports: [Progress],
  templateUrl: './setup-progress.html',
})
export class SetupProgress {}`;
}
