import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { getAuthHeaders } from "../auth/auth-header";
import { ApiResponse } from "../models/apiResponse.model";


@Injectable
({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl =  `${environment.baseUrl}/summary`;
    authService: any;

    constructor(private http: HttpClient) {}

    summaryForAdmin(params?: { startDate?: string; endDate?: string}): Observable<ApiResponse> {
        let httpParams = new HttpParams();
        if (params) {
            if (params.startDate) {
                httpParams = httpParams.set('startDate', params.startDate);
            }
            if (params.endDate) {
                httpParams = httpParams.set('endDate', params.endDate);
            }
        }
        return this.http.post<ApiResponse>(`${this.apiUrl}/summaryForAdmin`, {
          headers: getAuthHeaders(),
          params: httpParams
        })
    }

    getFelxibleDataOfSale(params?: { period?: string}): Observable<ApiResponse> {
        let httpParams = new HttpParams();
        if (params) {
            if (params.period) {
                httpParams = httpParams.set('period', params.period);
            }else {
                httpParams = httpParams.set('period', 'month');
            }
        }
        return this.http.get<ApiResponse>(`${this.apiUrl}/getFelxibleDataOfSale`, {
            headers: getAuthHeaders(),
            params: httpParams
            })
    }

    sevendaysTotalSale(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}/sevendaysTotalSale`, {
          headers: getAuthHeaders()
        })
    }
}    