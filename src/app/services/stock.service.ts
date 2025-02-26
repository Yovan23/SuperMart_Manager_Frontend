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
export class CategoryService {
    private apiUrl =  `${environment.baseUrl}/stock`;
    authService: any;

    constructor(private http: HttpClient) {}

    getAllCategory(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}/getAllProductStock`, {
          headers: getAuthHeaders()
        })
    }

    createCategory(stock: Stock): Observable<Stock> {
        return this.http.post<Stock>(`${this.apiUrl}/addStock`, stock, {
            headers: getAuthHeaders()
        });
    }
   
    updateCategory({ stock, _id }: { stock: Stock; _id: string; }): Observable<Stock> {
        return this.http.put<Stock>(`${this.apiUrl}/updateStock/${_id}`, stock, {
            headers: getAuthHeaders()
        });
    }
}    