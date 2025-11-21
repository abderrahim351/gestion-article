import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIf, NgFor, NgClass, SlicePipe } from '@angular/common';

import { AuthService } from './core/services/auth.service';
import { SocketService } from './core/services/socket.service';
import { NotificationService } from './core/services/notification.service';
import { Notification } from './core/models/notification.model';

import { UiNotificationComponent } from './shared/components/ui-notification/ui-notification.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgIf,
    NgFor,
    NgClass,
    SlicePipe,
    UiNotificationComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  notifications: Notification[] = [];
  showNotifications = false;

  showUserMenu = false;
  @ViewChild('userMenuWrapper') userMenuWrapper?: ElementRef;

  constructor(
    public auth: AuthService,
    private socketService: SocketService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.socketService.connect(user.id);
    }
  }

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.loadNotifications();
    }

    this.socketService.onNewCommentNotification().subscribe(() => {
      const userNow = this.auth.getCurrentUser();
      if (!userNow) return;
      this.loadNotifications();
    });
  }

  loadNotifications() {
    this.notificationService.getLast24h().subscribe({
      next: (list) => (this.notifications = list),
    });
  }

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  openNotification(notification: Notification) {
    this.notificationService.markAsRead(notification.id).subscribe({
      next: (updated) => {
        this.notifications = this.notifications.map((n) =>
          n.id === updated.id ? updated : n
        );
        this.router.navigate(['/articles', updated.articleId]);
        this.showNotifications = false;
      },
      error: () => {
        this.router.navigate(['/articles', notification.articleId]);
        this.showNotifications = false;
      },
    });
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }

  logout() {
    this.auth.logout();
    this.notifications = [];
    this.showNotifications = false;
    this.showUserMenu = false;
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.showUserMenu) return;
    const target = event.target as HTMLElement;
    if (!this.userMenuWrapper?.nativeElement.contains(target)) {
      this.showUserMenu = false;
    }
  }
}
