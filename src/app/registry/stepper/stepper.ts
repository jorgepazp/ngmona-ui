import { Component, computed, input } from '@angular/core';
import { LucideCheck } from '@lucide/angular';

type StepState = 'completed' | 'current' | 'upcoming';

interface StepView {
  index: number;
  label?: string;
  state: StepState;
}

/**
 * Horizontal multi-step progress indicator: numbered circles connected by a fill line, with a
 * checkmark on completed steps and the active step marked with `aria-current="step"`.
 */
@Component({
  selector: 'ui-stepper',
  imports: [LucideCheck],
  templateUrl: './stepper.html',
})
export class Stepper {
  /** Total number of steps. Ignored when `labels` is provided — its length wins instead. */
  readonly steps = input(3);
  /** Optional label shown under each step's circle. */
  readonly labels = input<string[] | null>(null);
  /** Zero-based index of the active step. */
  readonly currentStep = input(0);

  protected readonly checkIcon = LucideCheck;

  protected readonly stepCount = computed(() => this.labels()?.length || this.steps());

  protected readonly stepViews = computed<StepView[]>(() => {
    const count = this.stepCount();
    const current = this.currentStep();
    const labels = this.labels();
    return Array.from({ length: count }, (_, i) => ({
      index: i,
      label: labels?.[i],
      state: i < current ? 'completed' : i === current ? 'current' : 'upcoming',
    }));
  });

  protected circleClass(state: StepState): string {
    switch (state) {
      case 'completed':
        return 'bg-primary-500 text-white';
      case 'current':
        return 'bg-primary-500 text-white ring-4 ring-primary-100';
      case 'upcoming':
      default:
        return 'bg-surface-medium text-white';
    }
  }

  protected lineClass(filled: boolean): string {
    return filled ? 'bg-primary-500' : 'bg-surface-medium';
  }
}
