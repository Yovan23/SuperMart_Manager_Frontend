import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Log } from '../models/log.model';
import { environment } from '../../environments/environment';
import { getAuthHeaders } from "../auth/auth-header";
import { ApiResponse } from "../models/apiResponse.model";

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private apiUrl = `${environment.baseUrl}/log`;

  constructor(private http: HttpClient) {}

  getAllLogs(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/getAllLogs`, {
      headers: getAuthHeaders()
    });
  }

  getLogsByDateRange(fromDate: string, toDate: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/getLogsByDateRange`,
      { fromDate, toDate },
      { headers: getAuthHeaders() }
    );
  }
  
}
