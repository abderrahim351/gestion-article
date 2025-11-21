import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { StorageService } from './storage.service.js';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'auth_user';

  constructor(private http: HttpClient, private storage: StorageService) {}

  register(payload: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload)
      .pipe(tap((res) => this.storeAuth(res)));
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(tap((res) => this.storeAuth(res)));
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getAccessToken(): string | null {
    return  this.storage.get(this.ACCESS_TOKEN_KEY);
  }

getCurrentUser(): User | null {
  const raw = this.storage.get(this.USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}


  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
updateCurrentUser(partial: Partial<User>): void {
  const current = this.getCurrentUser();
  if (!current) return;

  const updated = { ...current, ...partial };
  this.storage.set(this.USER_KEY, JSON.stringify(updated));
}
  private storeAuth(res: AuthResponse) {
   this.storage.set(this.ACCESS_TOKEN_KEY, res.accessToken);
   this.storage.set(this.REFRESH_TOKEN_KEY, res.refreshToken);
   this.storage.set(this.USER_KEY, JSON.stringify(res.user));
  }
}
