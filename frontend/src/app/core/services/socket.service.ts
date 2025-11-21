import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket: Socket | null = null;

  connect(userId?: string) {
    if (!this.socket) {
      this.socket = io(environment.wsUrl, {
        withCredentials: true,
      });
    }
    if (userId && this.socket) {
      this.socket.emit('join', userId);
    }
  }

  onNewCommentNotification(): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.socket) return;
      this.socket.on('notification:new-comment', (payload) => {
        subscriber.next(payload);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
