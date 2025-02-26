import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from '../models/supplier.model';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/apiResponse.model';
import { getAuthHeaders } from '../auth/auth-header';
import { Product } from '../models/product.model';

@Injectable
({
    providedIn: 'root'
})

export class SupplierService {
    private apiUrl = `${environment.baseUrl}/supplier`;

    constructor(private http: HttpClient) {}

    getAllSupplier(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}/getAllSupplier`, {
            headers: getAuthHeaders()
        });
    }

    getSupplierById(_id: string): Observable<Supplier> {
        return this.http.get<Supplier>(`${this.apiUrl}/getSupplier/${_id}`, {
            headers: getAuthHeaders()
        });
    }

    createSupplier(supplier: Supplier): Observable<Supplier> {
        return this.http.post<Supplier>(`${this.apiUrl}/createSupplier`, supplier, {
            headers: getAuthHeaders()
        });
    }

    updateSupplier({supplier, _id}: {supplier: Supplier, _id: string}): Observable<Supplier> {
        return this.http.put<Supplier>(`${this.apiUrl}/updateSupplier/${_id}`, supplier, {
            headers: getAuthHeaders()
        });
    }

    deleteSupplier(_id: string): Observable<boolean> {
        return this.http.post<boolean>(`${this.apiUrl}/deleteSupplier/${_id}`, {
            headers: getAuthHeaders()
        });
    }

    addProductToSupplier(supplierId: string, product: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/addProductToSupplier`, { supplierId: supplierId, products: [product] }, { 
            headers: getAuthHeaders() 
        });
    }
}