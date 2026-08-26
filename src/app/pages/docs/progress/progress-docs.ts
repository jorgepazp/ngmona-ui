import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Progress } from '../../../registry/progress/progress';
import { progressApi } from '../../../registry/progress/progress.api';

@Component({
  selector: 'docs-progress',
  imports: [Progress, ApiTable],
  templateUrl: './progress-docs.html',
})
export default class ProgressDocs {
  protected readonly api = progressApi;
}
