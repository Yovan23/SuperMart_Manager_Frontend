import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { getAuthHeaders } from '../auth/auth-header';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.baseUrl}/user`;
  authService: any;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<ApiResponse> {
    return this.http
      .get<ApiResponse>(`${this.apiUrl}/getAllUsers`, {
        headers: getAuthHeaders(),
      })
      .pipe(tap((users) => console.log('fetched users:', users)));
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/getUserById/${id}`, {
      headers: getAuthHeaders(),
    });
  }

  createUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/createUser`, formData, {
      headers: getAuthHeaders(),
    });
  }

  updateUser({ user, _id }: { user: User; _id: string }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/updateUser/${_id}`, user, {
      headers: getAuthHeaders(),
    });
  }

  changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<boolean> {
    return this.http.put<boolean>(
      `${this.apiUrl}/changePassword/${id}`,
      { oldPassword, newPassword, confirmPassword },
      {
        headers: getAuthHeaders(),
      }
    );
  }

  deleteUser(_id: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/deleteUser/${_id}`, {
      headers: getAuthHeaders(),
    });
  }

  sendResetPasswordEmail(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/resetPassword-send-mail`,
      { email }
    );
  }

  verifyResetToken(token: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}/reset-password/verify?token=${token}`
    );
  }

  resetPassword(newPassword: string, token: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/reset-password/new`, {
      newPassword,
      token,
    });
  }
}
