import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  updateUserRole(id: string, role: User['role']): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${id}/role`, { role });
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  updateMe(payload: { name: string }): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/me`, payload);
  }
}
