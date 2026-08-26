import { Component, signal } from '@angular/core';
import { Textarea } from '../../../registry/textarea/textarea';
import { textareaApi } from '../../../registry/textarea/textarea.api';
import { ApiTable } from '../../../docs-ui/api-table/api-table';

@Component({
  selector: 'docs-textarea',
  imports: [Textarea, ApiTable],
  templateUrl: './textarea-docs.html',
})
export default class TextareaDocs {
  protected readonly text = signal('');
  protected readonly api = textareaApi;
}
