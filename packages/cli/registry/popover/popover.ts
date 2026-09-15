import { Component, ElementRef, TemplateRef, ViewContainerRef, effect, inject, input, model, viewChild } from '@angular/core';
import { DEFAULT_FLOATING_POSITIONS, FloatingPanel } from '../shared/floating-panel';

/**
 * Generic trigger and floating panel. Mark the trigger element with the `trigger` attribute;
 * every other projected child becomes the panel body, rendered only once the popover opens.
 */
@Component({
  selector: 'ui-popover',
  templateUrl: './popover.html',
  providers: [FloatingPanel],
})
export class Popover {
  /** Whether the panel is open. Two-way bindable via `[(open)]`; also flips back to `false` when the panel closes itself (outside click, escape). */
  readonly open = model(false);
  /** Stretches the panel to match the trigger's width instead of sizing to its own content. */
  readonly matchTriggerWidth = input(false);
  /** Extra utility classes applied to the floating panel element. */
  readonly panelClass = input('');
  /** Preferred side of the trigger to open on. */
  readonly placement = input<'bottom' | 'top'>('bottom');

  private readonly floatingPanel = inject(FloatingPanel);
  private readonly viewContainerRef = inject(ViewContainerRef);

  protected readonly triggerEl = viewChild<ElementRef<HTMLElement>>('trigger');
  protected readonly panelTemplate = viewChild<TemplateRef<unknown>>('panel');

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const trigger = this.triggerEl()?.nativeElement;
      const panel = this.panelTemplate();
      if (!trigger || !panel) return;

      if (isOpen) {
        const positions =
          this.placement() === 'top' ? [...DEFAULT_FLOATING_POSITIONS].reverse() : DEFAULT_FLOATING_POSITIONS;
        this.floatingPanel.open(trigger, panel, this.viewContainerRef, {
          matchOriginWidth: this.matchTriggerWidth(),
          panelClass: this.panelClass(),
          positions,
        });
      } else {
        this.floatingPanel.close();
      }
    });

    effect(() => {
      if (!this.floatingPanel.isOpen() && this.open()) {
        this.open.set(false);
      }
    });
  }

  protected toggle(): void {
    this.open.set(!this.open());
  }
}
