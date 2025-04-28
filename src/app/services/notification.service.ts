import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { getAuthHeaders } from '../auth/auth-header';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = `${environment.baseUrl}/notification`;

    constructor(private http: HttpClient) { }

    getNotification(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}/getNotification`, {
            headers: getAuthHeaders()
        });
    }
}