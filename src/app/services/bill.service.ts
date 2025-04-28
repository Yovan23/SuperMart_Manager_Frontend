import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
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
    
    getAllBill(params?: { startDate?: string; endDate?: string; status?: string }): Observable<ApiResponse> {
        let httpParams = new HttpParams();
        if (params) {
          if (params.startDate) {
            httpParams = httpParams.set('startDate', params.startDate);
          }
          if (params.endDate) {
            httpParams = httpParams.set('endDate', params.endDate);
          }
          if (params.status) {
            httpParams = httpParams.set('status', params.status);
          }
        }
        return this.http.get<ApiResponse>(`${this.apiUrl}/getAllBill`, {
          headers: getAuthHeaders(),
          params: httpParams
        });
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

    addProductToBill({ barcode, billId ,qty}: { barcode: string; billId: string; qty:number }): Observable<Bill> {
        return this.http.post<Bill>(`${this.apiUrl}/addProductToBill`, { barcode, billId, qty}, {
            headers: getAuthHeaders()
        });
    }

    addPaymentToBill({ paymentDetails, billId }: { paymentDetails: any; billId: string; }): Observable<Bill> {
        return this.http.post<Bill>(`${this.apiUrl}/addPayment`, { billId, paymentDetails }, {
            headers: getAuthHeaders()
        });
    }    

    addDiscountToBill({ discount, billId }: { discount: number; billId: string; }): Observable<Bill> {
        return this.http.post<Bill>(`${this.apiUrl}/addDiscount`, { discount, billId }, {
            headers: getAuthHeaders()
        });
    }

    verifyPayment({razorpay_order_id, razorpay_payment_id, razorpay_signature, billId}: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string, billId: string }): Observable<Bill> {
        return this.http.post<Bill>(`${this.apiUrl}/verifyPayment`, {razorpay_order_id, razorpay_payment_id, razorpay_signature, billId}, {
                headers: getAuthHeaders()
        });
    }

    removeItemFromBill({billId, productId}: {billId: string, productId: string}): Observable<Bill> {
        return this.http.post<Bill>(`${this.apiUrl}/removeItemFromBill`, {billId, productId}, {
                headers: getAuthHeaders()
        });
    }
}