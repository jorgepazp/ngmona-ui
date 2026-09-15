import { Injectable, signal } from '@angular/core';
import type { NotificationPosition, NotificationType } from '../notification/notification';

export interface ToastOptions {
  type?: NotificationType;
  position?: NotificationPosition;
  /** Auto-dismiss after this many ms. `0` disables auto-dismiss. */
  duration?: number;
  showCloseButton?: boolean;
}

export interface ToastEntry {
  id: number;
  message: string;
  type: NotificationType;
  position: NotificationPosition;
  showCloseButton: boolean;
}

/**
 * Queues toast messages for `Toaster` to render (mount one `Toaster`, typically in the app
 * shell). Each entry renders with the `Notification` component in `stacked` mode; this service
 * adds the queueing, auto-dismiss and stacking behavior that `Notification` alone doesn't have.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSignal = signal<ToastEntry[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  private nextId = 0;

  /** Queues a toast and returns its id (pass to `dismiss` to remove it early). Auto-dismisses after `options.duration` ms (default 4000; `0` disables). */
  show(message: string, options?: ToastOptions): number {
    const id = this.nextId++;
    const entry: ToastEntry = {
      id,
      message,
      type: options?.type ?? 'info',
      position: options?.position ?? 'top-right',
      showCloseButton: options?.showCloseButton ?? true,
    };
    this.toastsSignal.update((list) => [...list, entry]);

    const duration = options?.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
    return id;
  }

  /** Shorthand for `show(message, { ...options, type: 'success' })`. */
  success(message: string, options?: Omit<ToastOptions, 'type'>): number {
    return this.show(message, { ...options, type: 'success' });
  }

  /** Shorthand for `show(message, { ...options, type: 'error' })`. */
  error(message: string, options?: Omit<ToastOptions, 'type'>): number {
    return this.show(message, { ...options, type: 'error' });
  }

  /** Shorthand for `show(message, { ...options, type: 'warning' })`. */
  warning(message: string, options?: Omit<ToastOptions, 'type'>): number {
    return this.show(message, { ...options, type: 'warning' });
  }

  /** Removes a single toast by the id returned from `show`/`success`/`error`/`warning`, before its auto-dismiss timer fires. */
  dismiss(id: number): void {
    this.toastsSignal.update((list) => list.filter((t) => t.id !== id));
  }

  /** Removes every currently queued toast immediately. */
  clear(): void {
    this.toastsSignal.set([]);
  }
}
