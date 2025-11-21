import { Component } from '@angular/core';
import { CommonModule, NgIf, NgClass } from '@angular/common';
import { UiNotificationService } from '../../../core/services/ui-notification.service';
import { UiNotification } from '../../../core/services/ui-notification.service';

@Component({
  selector: 'app-ui-notification',
  standalone: true,
  imports: [CommonModule, NgIf, NgClass],
  templateUrl: './ui-notification.component.html',
})
export class UiNotificationComponent {
  current: UiNotification | null = null;

  constructor(private uiNotification: UiNotificationService) {
    this.uiNotification.notification$.subscribe((notif) => {
      this.current = notif;
    });
  }

  close() {
    this.current = null;
  }

  getClasses() {
    if (!this.current) return '';

    switch (this.current.type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      case 'info':
      default:
        return 'bg-blue-600';
    }
  }
}
