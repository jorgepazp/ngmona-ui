import { Component, signal } from '@angular/core';
import { LucideMail } from '@lucide/angular';
import { Input } from '../../../registry/input/input';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { inputApi } from '../../../registry/input/input.api';

@Component({
  selector: 'docs-input',
  imports: [Input, ApiTable, CodeTabs],
  templateUrl: './input-docs.html',
})
export default class InputDocs {
  protected readonly mailIcon = LucideMail;
  protected readonly text = signal('');
  protected readonly countries = ['Argentina', 'Chile', 'Uruguay', 'Brazil', 'Paraguay'];
  protected readonly api = inputApi;

  protected readonly basicHtml = `<ui-input label="Email" placeholder="you@example.com" [icon]="mailIcon" [(value)]="text"></ui-input>`;

  protected readonly basicTs = `import { Component, signal } from '@angular/core';
import { LucideMail } from '@lucide/angular';
import { Input } from './ui/input/input';

@Component({
  selector: 'app-email-field',
  imports: [Input],
  templateUrl: './email-field.html',
})
export class EmailField {
  mailIcon = LucideMail;
  text = signal('');
}`;

  protected readonly passwordHtml = `<ui-input type="password" label="Password" placeholder="••••••••"></ui-input>`;

  protected readonly passwordTs = `import { Component } from '@angular/core';
import { Input } from './ui/input/input';

@Component({
  selector: 'app-password-field',
  imports: [Input],
  templateUrl: './password-field.html',
})
export class PasswordField {}`;

  protected readonly statesHtml = `<ui-input label="Success" state="success" caption="Looks good"></ui-input>
<ui-input label="Warning" state="warning" caption="Double check this"></ui-input>
<ui-input label="Error" state="error" caption="This field is required"></ui-input>
<ui-input label="Disabled" [disabled]="true" placeholder="Can't type here"></ui-input>`;

  protected readonly statesTs = `import { Component } from '@angular/core';
import { Input } from './ui/input/input';

@Component({
  selector: 'app-input-states',
  imports: [Input],
  templateUrl: './input-states.html',
})
export class InputStates {}`;

  protected readonly searchHtml = `<ui-input label="Country" placeholder="Search..." [searchIn]="countries"></ui-input>`;

  protected readonly searchTs = `import { Component } from '@angular/core';
import { Input } from './ui/input/input';

@Component({
  selector: 'app-country-field',
  imports: [Input],
  templateUrl: './country-field.html',
})
export class CountryField {
  countries = ['Argentina', 'Chile', 'Uruguay', 'Brazil', 'Paraguay'];
}`;
}
