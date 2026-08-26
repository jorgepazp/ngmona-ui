import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Button } from '../../../registry/button/button';
import { Notification, NotificationType } from '../../../registry/notification/notification';
import { notificationApi } from '../../../registry/notification/notification.api';

@Component({
  selector: 'docs-notification',
  imports: [Notification, Button, ApiTable],
  templateUrl: './notification-docs.html',
})
export default class NotificationDocs {
  protected readonly activeType = signal<NotificationType | null>(null);
  protected readonly api = notificationApi;

  protected trigger(type: NotificationType): void {
    this.activeType.set(type);
    setTimeout(() => this.activeType.set(null), 3000);
  }
}
