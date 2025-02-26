import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';
import { getAuthHeaders } from "../auth/auth-header";
import { ApiResponse } from "../models/apiResponse.model";


@Injectable
({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl =  `${environment.baseUrl}/category`;
    authService: any;

    constructor(private http: HttpClient) {}

    getAllCategory(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}/getAllCategory`, {
          headers: getAuthHeaders()
        })
      }

    getCategoryById(_id: String): Observable<Category> {
        return this.http.get<Category>(`${this.apiUrl}/getCategoryById/${_id}`, {
            headers: getAuthHeaders()
        })
    }

    createCategory(category: Category): Observable<Category> {
        return this.http.post<Category>(`${this.apiUrl}/createCategory`, category, {
            headers: getAuthHeaders()
        });
    }
   
    updateCategory({ category, _id }: { category: Category; _id: string; }): Observable<Category> {
        return this.http.put<Category>(`${this.apiUrl}/updateCategory/${_id}`, category, {
            headers: getAuthHeaders()
        });
    }

    deleteCategory(_id: string): Observable<Category> {
        return this.http.post<Category>(`${this.apiUrl}/deleteCategory/${_id}`, {
            headers: getAuthHeaders()
        });
    }
}    