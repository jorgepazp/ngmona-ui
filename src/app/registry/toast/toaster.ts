import { Component, computed, inject } from '@angular/core';
import { Notification, type NotificationPosition } from '../notification/notification';
import { ToastEntry, ToastService } from './toast.service';

/**
 * Mount once (e.g. in the app shell). Renders whatever `ToastService` queues, stacked per corner.
 * Inject `ToastService` anywhere to push toasts: `toastService.success('Saved!')`.
 */
@Component({
  selector: 'ui-toaster',
  imports: [Notification],
  templateUrl: './toaster.html',
})
export class Toaster {
  private readonly toastService = inject(ToastService);

  protected readonly groups = computed(() => {
    const byPosition = new Map<NotificationPosition, ToastEntry[]>();
    for (const toast of this.toastService.toasts()) {
      const group = byPosition.get(toast.position) ?? [];
      group.push(toast);
      byPosition.set(toast.position, group);
    }
    return [...byPosition.entries()];
  });

  protected containerClass(position: NotificationPosition): string {
    const stackDirection = position.startsWith('bottom') ? 'flex-col-reverse' : 'flex-col';
    const base = `fixed z-[10000] flex ${stackDirection} gap-4 max-w-[calc(100vw-1rem)]`;
    switch (position) {
      case 'top-left':
        return `${base} top-4 left-4`;
      case 'top-right':
        return `${base} top-4 right-4`;
      case 'bottom-left':
        return `${base} bottom-4 left-4`;
      case 'bottom-right':
        return `${base} bottom-4 right-4`;
      case 'bottom-center':
        return `${base} bottom-4 left-1/2 -translate-x-1/2`;
      case 'top-center':
      default:
        return `${base} top-4 left-1/2 -translate-x-1/2`;
    }
  }

  protected dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
