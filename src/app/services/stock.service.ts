import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock.model';
import { environment } from '../../environments/environment';
import { getAuthHeaders } from "../auth/auth-header";
import { ApiResponse } from "../models/apiResponse.model";


@Injectable
({
    providedIn: 'root'
})
export class StockService {
    private apiUrl =  `${environment.baseUrl}/stock`;
    authService: any;

    constructor(private http: HttpClient) {}

    getAllStock(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}/getAllStock`, {
          headers: getAuthHeaders()
        })
    }

    createStock(stock: Stock): Observable<Stock> {
        return this.http.post<Stock>(`${this.apiUrl}/addStock`, stock, {
            headers: getAuthHeaders()
        });
    }
   
    updateStock({ stock, _id }: { stock: Stock; _id: string; }): Observable<Stock> {
        return this.http.post<Stock>(`${this.apiUrl}/updateStock/${_id}`, stock, {
            headers: getAuthHeaders()
        });
    }
}    