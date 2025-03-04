import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Bill } from "../models/bill.model";
import { environment } from "../../environments/environment";
import { getAuthHeaders } from "../auth/auth-header";
import { ApiResponse } from "../models/apiResponse.model";

@Injectable
({
    providedIn:  'root'
})
export class BillService {
    private apiUrl = `${environment.baseUrl}/bill`;
    authService: any;

    constructor(private http: HttpClient) {}

    getAllBill(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}/getAllBill`, {
            headers: getAuthHeaders()
        })
    }

    getBillById(_id: String): Observable<Bill> {
        return this.http.get<Bill>(`${this.apiUrl}/getBillById/${_id}`, {
            headers: getAuthHeaders()
        })
    }

    createBill({phone, email}: { phone: string; email: string }): Observable<any> { 
        return this.http.post<any>(`${this.apiUrl}/createBill`, {phone, email}, {  
            headers: getAuthHeaders()
        });
    }

    addProductToBill({ barcode, billId }: { barcode: string; billId: string; }): Observable<Bill> {
        return this.http.post<Bill>(`${this.apiUrl}/addProductToBill`, { barcode, billId }, {
            headers: getAuthHeaders()
        });
    }

    addPaymentToBill({ paymentDetails, billId }: { paymentDetails: any; billId: string; }): Observable<Bill> {
        return this.http.post<Bill>(`${this.apiUrl}/addPayment`, { billId, paymentDetails }, {
            headers: getAuthHeaders()
        });
    }    

    addDiscountToBill({ discount, billId }: { discount: number; billId: string; }): Observable<Bill> {
        return this.http.post<Bill>(`${this.apiUrl}/addDiscount`, { discount }, {
            headers: getAuthHeaders()
        });
    }
}