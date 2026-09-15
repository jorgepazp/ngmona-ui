// GENERATED FILE — do not edit by hand. Run `npm run api-docs` to regenerate.
import type { ComponentApiDoc } from '../../docs-ui/api-table/api-table';

export const stepperApi: ComponentApiDoc = {
  name: "Stepper",
  description: "Horizontal multi-step progress indicator: numbered circles connected by a fill line, with a checkmark on completed steps and the active step marked with `aria-current=\"step\"`.",
  props: [
    {
      name: "steps",
      kind: "input",
      required: false,
      type: "number",
      defaultValue: "3",
      description: "Total number of steps. Ignored when `labels` is provided — its length wins instead.",
    },
    {
      name: "labels",
      kind: "input",
      required: false,
      type: "string[] | null",
      defaultValue: "null",
      description: "Optional label shown under each step's circle.",
    },
    {
      name: "currentStep",
      kind: "input",
      required: false,
      type: "number",
      defaultValue: "0",
      description: "Zero-based index of the active step.",
    },
  ],
};
