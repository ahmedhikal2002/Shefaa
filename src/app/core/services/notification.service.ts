import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { INotification } from '../../shared/interfaces/Notification/inotification';
import { IPaginatedResponse } from '../../shared/interfaces/Common/ipaginated-response';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly baseUrl = 'https://smart-medical-system.runasp.net/api/Notifications';

  constructor(private http: HttpClient) {}

  // ===========================
  // Get All Notifications
  // ===========================

  getNotifications(
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<IPaginatedResponse<INotification>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);

    return this.http.get<IPaginatedResponse<INotification>>(this.baseUrl, { params });
  }

  // ===========================
  // Get Unread Notifications
  // ===========================

  getUnreadNotifications(
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<IPaginatedResponse<INotification>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);

    return this.http.get<IPaginatedResponse<INotification>>(`${this.baseUrl}/unread`, { params });
  }

  // ===========================
  // Get Unread Count
  // ===========================

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/unread-count`);
  }

  // ===========================
  // Mark As Read
  // ===========================

  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${notificationId}/read`, {});
  }

  // ===========================
  // Mark All As Read
  // ===========================
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/read-all`, {});
  }
}
