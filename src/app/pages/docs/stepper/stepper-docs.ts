import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Stepper } from '../../../registry/stepper/stepper';
import { stepperApi } from '../../../registry/stepper/stepper.api';
import { Button } from '../../../registry/button/button';

@Component({
  selector: 'docs-stepper',
  imports: [Stepper, Button, ApiTable],
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
}
