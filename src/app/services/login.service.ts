
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Login } from '../models/login.model';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.baseUrl}/auth`;
  
  constructor(private http: HttpClient) {}

  login(logindata: Login): Observable<any> {
    console.log(this.apiUrl);

    return this.http.post<any>(`${this.apiUrl}/login`, logindata).pipe(
      tap(response => {
        if (response.data) {
          this.setSession(response.data);
        }
      })
    );
  }

  validateToken(): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/user/loggedUser`);
  }

  private setSession(authResult: any) {
    console.log(authResult.accessToken);
    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('refreshToken', authResult.refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {
      refreshToken: this.getRefreshToken()
    }).pipe(
      tap(response => {
        if (response.data) {
          this.setSession(response.data);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  
}