import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type UiNotificationType = 'success' | 'error' | 'info';

export interface UiNotification {
  message: string;
  type: UiNotificationType;
}

@Injectable({ providedIn: 'root' })
export class UiNotificationService {
  private notificationSubject = new Subject<UiNotification | null>();
  notification$ = this.notificationSubject.asObservable();

  show(
    message: string,
    type: UiNotificationType = 'success',
    durationMs: number = 3000
  ) {
    const notif: UiNotification = { message, type };
    this.notificationSubject.next(notif);

    if (durationMs > 0) {
      setTimeout(() => {
        this.notificationSubject.next(null);
      }, durationMs);
    }
  }

  showSuccess(message: string, durationMs: number = 3000) {
    this.show(message, 'success', durationMs);
  }

  showError(message: string, durationMs: number = 3000) {
    this.show(message, 'error', durationMs);
  }

  showInfo(message: string, durationMs: number = 3000) {
    this.show(message, 'info', durationMs);
  }

  clear() {
    this.notificationSubject.next(null);
  }
}
