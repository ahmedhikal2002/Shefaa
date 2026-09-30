import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';

import { INotification } from '../../shared/interfaces/Notification/inotification';
import { AuthenticationService } from './authenticationService.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationHubService {
  private hubConnection!: signalR.HubConnection;

  private readonly notifications = signal<INotification[]>([]);

  private readonly unreadCount = signal(0);

  constructor(private authService: AuthenticationService) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://smart-medical-system.runasp.net/notificationHub', {
        accessTokenFactory: () => this.authService.getAccessToken() ?? '',
      })
      .withAutomaticReconnect()
      .build();

    // Register events once
    this.registerEvents();

    // Connection lifecycle
    this.hubConnection.onreconnecting((error) => {
      console.warn('🔄 SignalR Reconnecting...', error);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('✅ SignalR Reconnected', connectionId);
    });

    this.hubConnection.onclose((error) => {
      console.warn('❌ SignalR Closed', error);
    });
  }

  // ==========================================
  // Connection
  // ==========================================

  async startConnection(): Promise<void> {
    if (this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
      return;
    }

    try {
      await this.hubConnection.start();

      console.log('✅ SignalR Connected', this.hubConnection.connectionId);
    } catch (error) {
      console.error('❌ SignalR Error', error);

      throw error;
    }
  }

  async stopConnection(): Promise<void> {
    if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      return;
    }

    await this.hubConnection.stop();

    console.log('🛑 SignalR Disconnected');
  }

  isConnected(): boolean {
    return this.hubConnection.state === signalR.HubConnectionState.Connected;
  }

  // ==========================================
  // SignalR Events
  // ==========================================

  private registerEvents(): void {
    this.hubConnection.off('ReceiveNotification');

    this.hubConnection.on('ReceiveNotification', (notification: INotification) => {
      console.log('📢 Notification Received', notification);

      const newNotification: INotification = {
        ...notification,

        isRead: false,

        isNew: true,
      };

      this.notifications.update((list) => [newNotification, ...list]);

      this.unreadCount.update((count) => count + 1);

      // Remove "new" state after animation
      setTimeout(() => {
        this.notifications.update((list) =>
          list.map((n) =>
            n.id === newNotification.id
              ? {
                  ...n,
                  isNew: false,
                }
              : n,
          ),
        );
      }, 1800);
    });
  }

  // ==========================================
  // Signals
  // ==========================================

  getNotifications() {
    return this.notifications.asReadonly();
  }

  getUnreadCount() {
    return this.unreadCount.asReadonly();
  }

  // ==========================================
  // State
  // ==========================================

  setNotifications(notifications: INotification[]): void {
    this.notifications.set(notifications);
  }

  setUnreadCount(count: number): void {
    this.unreadCount.set(count);
  }

  // ==========================================
  // Read
  // ==========================================

  markAsRead(notificationId: number): void {
    this.notifications.update((list) =>
      list.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              isRead: true,
            }
          : notification,
      ),
    );

    this.unreadCount.update((count) => Math.max(0, count - 1));
  }

  markAllAsRead(): void {
    this.notifications.update((list) =>
      list.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );

    this.unreadCount.set(0);
  }

  // ==========================================
  // Clear
  // ==========================================

  clear(): void {
    this.notifications.set([]);

    this.unreadCount.set(0);
  }
}
