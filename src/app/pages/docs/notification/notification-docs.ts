import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Button } from '../../../registry/button/button';
import { Notification, NotificationType } from '../../../registry/notification/notification';
import { notificationApi } from '../../../registry/notification/notification.api';

const MESSAGES: Record<NotificationType, string> = {
  info: 'Heads up: this is an info notification.',
  success: 'Saved successfully.',
  warning: 'Double-check that before continuing.',
  error: 'Something went wrong.',
  neutral: 'A neutral, low-emphasis notification.',
};

@Component({
  selector: 'docs-notification',
  imports: [Notification, Button, ApiTable, CodeTabs],
  templateUrl: './notification-docs.html',
})
export default class NotificationDocs {
  protected readonly api = notificationApi;

  protected readonly show = signal(false);
  protected readonly currentType = signal<NotificationType | null>(null);
  protected readonly currentMessage = signal('');

  private readonly queue: NotificationType[] = [];
  private dismissed = true;
  private autoDismissTimer?: ReturnType<typeof setTimeout>;

  /** Enqueues a notification; only one is ever on screen, so a burst of clicks plays back FIFO. */
  protected trigger(type: NotificationType): void {
    this.queue.push(type);
    if (this.dismissed) this.advance();
  }

  private advance(): void {
    const type = this.queue.shift();
    if (type === undefined) return;

    this.dismissed = false;
    this.currentType.set(type);
    this.currentMessage.set(MESSAGES[type]);
    this.show.set(true);
    this.autoDismissTimer = setTimeout(() => this.dismiss(), 3000);
  }

  /** Handles both auto-dismiss and the notification's own close button — either can fire first. */
  protected dismiss(): void {
    if (this.dismissed) return;
    this.dismissed = true;
    clearTimeout(this.autoDismissTimer);
    this.show.set(false);
    // Let the 200ms leave animation finish before the next queued notification fades in.
    setTimeout(() => this.advance(), 200);
  }

  protected readonly basicHtml = `<button uiButton size="sm" (click)="trigger('success')">Show notification</button>

<ui-notification
  [show]="show()"
  [type]="currentType() ?? 'success'"
  position="top-center"
  (closed)="dismiss()"
>
  {{ currentMessage() }}
</ui-notification>`;

  protected readonly basicTs = `import { Component, signal } from '@angular/core';
import { Button } from './ui/button/button';
import { Notification, type NotificationType } from './ui/notification/notification';

const MESSAGES: Record<NotificationType, string> = {
  success: 'Saved successfully.',
  // ...other types
};

@Component({
  selector: 'app-save-notification',
  imports: [Notification, Button],
  templateUrl: './save-notification.html',
})
export class SaveNotification {
  show = signal(false);
  currentType = signal<NotificationType | null>(null);
  currentMessage = signal('');

  private queue: NotificationType[] = [];
  private dismissed = true;
  private autoDismissTimer?: ReturnType<typeof setTimeout>;

  // Enqueues a notification; only one is ever on screen, so a burst of triggers plays back FIFO.
  trigger(type: NotificationType): void {
    this.queue.push(type);
    if (this.dismissed) this.advance();
  }

  private advance(): void {
    const type = this.queue.shift();
    if (type === undefined) return;

    this.dismissed = false;
    this.currentType.set(type);
    this.currentMessage.set(MESSAGES[type]);
    this.show.set(true);
    this.autoDismissTimer = setTimeout(() => this.dismiss(), 3000);
  }

  dismiss(): void {
    if (this.dismissed) return;
    this.dismissed = true;
    clearTimeout(this.autoDismissTimer);
    this.show.set(false);
    setTimeout(() => this.advance(), 200);
  }
}`;
}
