import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Stepper } from '../../../registry/stepper/stepper';
import { stepperApi } from '../../../registry/stepper/stepper.api';
import { Button } from '../../../registry/button/button';

@Component({
  selector: 'docs-stepper',
  imports: [Stepper, Button, ApiTable, CodeTabs],
  templateUrl: './stepper-docs.html',
})
export default class StepperDocs {
  protected readonly labels = ['Cart', 'Shipping', 'Payment', 'Confirmation'];
  protected readonly current = signal(1);
  protected readonly api = stepperApi;

  protected back(): void {
    this.current.update((s) => Math.max(0, s - 1));
  }

  protected forward(): void {
    this.current.update((s) => Math.min(this.labels.length - 1, s + 1));
  }

  protected readonly interactiveHtml = `<ui-stepper [labels]="labels" [currentStep]="current()"></ui-stepper>
<button uiButton variant="secondary" size="sm" [disabled]="current() === 0" (click)="back()">Back</button>
<button uiButton size="sm" [disabled]="current() === labels.length - 1" (click)="forward()">Next</button>`;

  protected readonly interactiveTs = `import { Component, signal } from '@angular/core';
import { Button } from './ui/button/button';
import { Stepper } from './ui/stepper/stepper';

@Component({
  selector: 'app-checkout-stepper',
  imports: [Stepper, Button],
  templateUrl: './checkout-stepper.html',
})
export class CheckoutStepper {
  labels = ['Cart', 'Shipping', 'Payment', 'Confirmation'];
  current = signal(1);

  back(): void {
    this.current.update((s) => Math.max(0, s - 1));
  }

  forward(): void {
    this.current.update((s) => Math.min(this.labels.length - 1, s + 1));
  }
}`;

  protected readonly noLabelsHtml = `<ui-stepper [steps]="5" [currentStep]="2"></ui-stepper>`;

  protected readonly noLabelsTs = `import { Component } from '@angular/core';
import { Stepper } from './ui/stepper/stepper';

@Component({
  selector: 'app-plain-stepper',
  imports: [Stepper],
  templateUrl: './plain-stepper.html',
})
export class PlainStepper {}`;

  protected readonly completedHtml = `<ui-stepper [labels]="labels" [currentStep]="labels.length"></ui-stepper>`;

  protected readonly completedTs = `import { Component } from '@angular/core';
import { Stepper } from './ui/stepper/stepper';

@Component({
  selector: 'app-completed-stepper',
  imports: [Stepper],
  templateUrl: './completed-stepper.html',
})
export class CompletedStepper {
  labels = ['Cart', 'Shipping', 'Payment', 'Confirmation'];
}`;
}
