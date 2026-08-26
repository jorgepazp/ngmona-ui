import { Directive, TemplateRef, inject, input } from '@angular/core';

/**
 * Named content-projection slot, e.g. `<ng-template uiTemplate="label">...</ng-template>`.
 * Lets a component accept an optional custom template for a specific named region
 * instead of (or in addition to) a plain string @Input.
 */
@Directive({
  selector: '[uiTemplate]',
})
export class UiTemplateDirective {
  /** The slot name a hosting component looks up via `contentChildren(UiTemplateDirective)` (e.g. `'label'`, `'header'`, `'cell-status'`). */
  readonly name = input<string>('', { alias: 'uiTemplate' });
  readonly template = inject(TemplateRef<unknown>);
}
