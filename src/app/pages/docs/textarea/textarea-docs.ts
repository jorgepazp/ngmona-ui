import { Component, signal } from '@angular/core';
import { Textarea } from '../../../registry/textarea/textarea';
import { textareaApi } from '../../../registry/textarea/textarea.api';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';

@Component({
  selector: 'docs-textarea',
  imports: [Textarea, ApiTable, CodeTabs],
  templateUrl: './textarea-docs.html',
})
export default class TextareaDocs {
  protected readonly text = signal('');
  protected readonly api = textareaApi;

  protected readonly bindingHtml = `<ui-textarea label="Feedback" placeholder="Tell us what you think" [(value)]="text" [maxLength]="140"></ui-textarea>
<p>length = {{ text().length }}</p>`;

  protected readonly bindingTs = `import { Component, signal } from '@angular/core';
import { Textarea } from './ui/textarea/textarea';

@Component({
  selector: 'app-feedback-field',
  imports: [Textarea],
  templateUrl: './feedback-field.html',
})
export class FeedbackField {
  text = signal('');
}`;

  protected readonly disabledHtml = `<ui-textarea label="Disabled" [disabled]="true" placeholder="Can't type here"></ui-textarea>`;

  protected readonly disabledTs = `import { Component } from '@angular/core';
import { Textarea } from './ui/textarea/textarea';

@Component({
  selector: 'app-disabled-textarea',
  imports: [Textarea],
  templateUrl: './disabled-textarea.html',
})
export class DisabledTextarea {}`;
}
