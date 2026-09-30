import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { ILogin } from '../../shared/interfaces/Authentication/ilogin';
import { ILoginResponse } from '../../shared/interfaces/Authentication/ILoginResponse';
import { IRefreshTokenResponse } from '../../shared/interfaces/Authentication/irefresh-token-response';
import { IRefreshTokenRequest } from '../../shared/interfaces/Authentication/irefresh-token-request';
import { IResetPassword } from '../../shared/interfaces/Authentication/i-reset-password';
import { NotificationHubService } from './notification-hub.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly baseUrl = 'https://smart-medical-system.runasp.net/api/';

  private readonly REFRESH_KEY = 'refreshToken';
  private readonly accessToken = signal<string | null>(null);
  private readonly defaultImage =
    'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png';

  readonly userImage = signal(this.defaultImage);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  // ================= APIs =================

  login(loginObj: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.baseUrl}Auth/login`, loginObj).pipe(
      tap((response) => {
        if (response.isSuccess) {
          this.setToken(response.accessToken, response.refreshToken);
        }
      }),
    );
  }

  refreshToken(): Observable<IRefreshTokenResponse> {
    const body: IRefreshTokenRequest = {
      refreshToken: this.getRefreshToken()!,
    };

    return this.http.post<IRefreshTokenResponse>(`${this.baseUrl}Auth/Refresh-Token`, body).pipe(
      tap((response) => {
        if (response.isSuccess) {
          this.setToken(response.accessToken, response.refreshToken);
        }
      }),
    );
  }

  restoreSession(): Observable<IRefreshTokenResponse> {
    return this.refreshToken();
  }

  resetEmail(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}Auth/forget-password`, { email });
  }

  resetPassword(passwordObj: IResetPassword): Observable<any> {
    return this.http.post(`${this.baseUrl}Auth/new-password`, passwordObj);
  }

  // ================= Access Token =================

  setToken(accessToken: string, refreshToken: string): void {
    this.accessToken.set(accessToken);
    localStorage.setItem(this.REFRESH_KEY, refreshToken);
    const decoded = jwtDecode<any>(accessToken);
    this.userImage.set(`https://smartmedicalsystem.runasp.net/${decoded['photo_url'] ?? ''}`);
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  // ================= Refresh Token =================
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  isAuthenticated(): boolean {
    return this.accessToken() !== null;
  }
  getUserRole(): string | null {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }
    const decoded = jwtDecode<any>(token);
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? null;
  }

  getUserId(): number {
    const token = this.getAccessToken();
    if (!token) {
      return 0;
    }
    const decoded = jwtDecode<any>(token);
    return decoded['base_person_id'] ?? null;
  }

  setUserImage(url: string | null | undefined) {
    this.userImage.set(
      !url || url === 'https://smartmedicalsystem.runasp.net/' ? this.defaultImage : url,
    );
  }

  getUserImage(): string {
    if (this.userImage() === '' || this.userImage() === null) {
      this.userImage.set(
        'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png',
      );
    }
    return this.userImage();
  }

  clearToken(): void {
    this.accessToken.set(null);
    localStorage.removeItem(this.REFRESH_KEY);
  }

  logout(): void {
    this.clearToken();
    void this.router.navigate(['/auth']);
  }
}
