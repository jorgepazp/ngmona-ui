import { Injectable, OnDestroy, TemplateRef, ViewContainerRef, inject, signal } from '@angular/core';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

/** Bottom-start primary, flips to top/end automatically when it doesn't fit. */
export const DEFAULT_FLOATING_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
];

export interface FloatingPanelConfig {
  positions?: ConnectedPosition[];
  /** Match the overlay's width to the origin element's width. */
  matchOriginWidth?: boolean;
  panelClass?: string;
}

/**
 * Shared CDK-Overlay wrapper for "anchor a floating panel to a trigger element" — flip/shift
 * positioning, closes on outside click or Escape, repositions on scroll. Add to a component's own
 * `providers: [FloatingPanel]` (not `providedIn: 'root'`) so each component instance gets its own.
 *
 * `Popover` is the generic (trigger + projected content) consumer of this. Combobox/Autocomplete/
 * Command use it directly since they need tighter control over their own input+listbox markup.
 */
@Injectable()
export class FloatingPanel implements OnDestroy {
  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;

  readonly isOpen = signal(false);

  open(
    origin: HTMLElement,
    template: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    config?: FloatingPanelConfig,
  ): void {
    if (this.overlayRef) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(config?.positions ?? DEFAULT_FLOATING_POSITIONS)
      .withFlexibleDimensions(false)
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      width: config?.matchOriginWidth ? origin.getBoundingClientRect().width : undefined,
      // CDK applies each entry via classList.add, which throws on a token containing spaces —
      // split a Tailwind-style class string into individual tokens rather than passing it whole.
      panelClass: config?.panelClass?.split(/\s+/).filter(Boolean),
    });

    this.overlayRef.attach(new TemplatePortal(template, viewContainerRef));
    this.isOpen.set(true);

    this.overlayRef.outsidePointerEvents().subscribe((event) => {
      if (!origin.contains(event.target as Node)) {
        this.close();
      }
    });
    this.overlayRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') this.close();
    });
    this.overlayRef.detachments().subscribe(() => this.isOpen.set(false));
  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.isOpen.set(false);
  }

  toggle(origin: HTMLElement, template: TemplateRef<unknown>, viewContainerRef: ViewContainerRef, config?: FloatingPanelConfig): void {
    this.isOpen() ? this.close() : this.open(origin, template, viewContainerRef, config);
  }

  updatePosition(): void {
    this.overlayRef?.updatePosition();
  }

  ngOnDestroy(): void {
    this.close();
  }
}
