import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';
import { getAuthHeaders } from "../auth/auth-header";
import { ApiResponse } from "../models/apiResponse.model";


@Injectable
({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl =  `${environment.baseUrl}/product`;

    constructor(private http: HttpClient) {}

    getAllProduct(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}/getAllProduct`, {
          headers: getAuthHeaders()
        })
      }

    getProductById(_id: String): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/getProductById/${_id}`, {
            headers: getAuthHeaders()
        })
    }

    createProduct(Product: Product): Observable<Product> {
        return this.http.post<Product>(`${this.apiUrl}/createProduct`, Product, {
            headers: getAuthHeaders()
        });
    }
   
    updateProduct({ Product, _id }: { Product: Product; _id: string; }): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/updateProduct/${_id}`, Product, {
            headers: getAuthHeaders()
        });
    }

    deleteProduct(_id: string): Observable<Product> {
        return this.http.post<Product>(`${this.apiUrl}/deleteProduct/${_id}`, {
            headers: getAuthHeaders()
        });
    }

    getProductByCategory(_id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/getProductByCategory/${_id}`, {
            headers: getAuthHeaders()
            });
    }

    getProductByBarCode(_id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/getProductByBarCode/${_id}`,{
            headers: getAuthHeaders()
            });
    }
}   