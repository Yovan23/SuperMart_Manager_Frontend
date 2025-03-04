import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Bill } from '../../models/bill.model';
import { BillService } from '../../services/bill.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import Razorpay from 'razorpay';

@Component({
    selector: 'app-bill',
    standalone: true,
    imports: [FormsModule, InputTextModule, ButtonModule, CommonModule, CheckboxModule],
    templateUrl: './bill.component.html',
    styleUrl: './bill.component.css'
})
export class BillComponent implements OnInit {
    bill: Bill[] = [];
    customerPhone: string = '';
    customerEmail: string = '';
    submittedBill: Bill | null = null;
    @ViewChild('itemInput') itemInput!: ElementRef;
    paymentMethod: any;


    constructor(private billService: BillService) {}

    ngOnInit(): void {}

    createBill(): void {
        if (!this.customerPhone && !this.customerEmail) {
            alert("Please provide either a phone number or an email address.");
            return;
        }
        this.billService.createBill({
            phone: this.customerPhone, 
            email: this.customerEmail
        }).subscribe({
            next: (response: any) => {
                if (response && response.success && response.data) {
                    console.log('Bill created successfully:', response.data);
                    this.bill.push(response.data);
                    this.submittedBill = response.data; 
        
                    setTimeout(() => {
                        this.itemInput?.nativeElement.focus();
                    }, 10);
                } else {
                    console.error('Bill creation failed:', response);
                    alert("Bill creation failed: " + (response?.message || "Unexpected error"));
                }
            },
            error: (error) => {
                console.error('Error creating bill:', error);
                alert("Error creating bill: " + error.message);
            }
        });
}       

addProductToBill(): void {
    const barcode = (document.getElementById('barcode') as HTMLInputElement).value;
    const quantity = (document.getElementById('quantity') as HTMLInputElement).value;

    if (!barcode) {
        alert('Please enter a valid barcode.');
        return;
    }

    if (!this.submittedBill) {
        alert('Please create a bill first.');
        return;
    }

    const productData = {
        billId: this.submittedBill._id, 
        barcode,
    };

    this.billService.addProductToBill(productData).subscribe({
        next: (response: any) => {
            if (response && response.success && response.data) {
                console.log('Product added successfully:', response.data);

                if (this.submittedBill) {
                    this.submittedBill = {
                        ...this.submittedBill, 
                        items: response.data.items, 
                        totalAmount: response.data.totalAmount 
                    };

                    (document.getElementById('barcode') as HTMLInputElement).value = '';
                    (document.getElementById('quantity') as HTMLInputElement).value = '1';

                    setTimeout(() => {
                        this.itemInput.nativeElement.focus();
                    }, 10);
                }
            } else {
                console.error('Failed to add product:', response);
                alert('Failed to add product: ' + (response?.message || 'Unexpected error'));
            }
        },
        error: (error: { message: string; }) => {
            console.error('Error adding product:', error);
            alert('Error adding product: ' + error.message);
        }
    });
}

processPayment(): void {
    if (!this.submittedBill) {
        alert('No bill found. Please create a bill first.');
        return;
    }

    if (!this.paymentMethod) {
        alert('Please select a payment method.');
        return;
    }

    const paymentDetails = {
        method: this.paymentMethod,
    };

    this.billService.addPaymentToBill({ billId: this.submittedBill._id, paymentDetails }).subscribe({
        next: (response: any) => {
            if (response && response.success) {
                this.openRazorpayPayment(response.data);
                console.log('Payment processed successfully:', response.data);
            } else {
                console.error('Payment failed:', response);
                alert('Payment failed: ' + (response?.message || 'Unexpected error'));
            }
        },
        error: (error) => {
            console.error('Error processing payment:', error);
            alert('Error processing payment: ' + error.message);
        }
    });
}

openRazorpayPayment(paymentData: any) {
    const options: any = {
        key: paymentData.key, // Razorpay Key ID
        amount: paymentData.amount, // Amount in paise (Razorpay expects amount in the smallest currency unit)
        currency: paymentData.currency,
        name: 'Supermarket',
        description: 'Test Transaction',
        order_id: paymentData.orderId,
        prefill: {
            email: this.customerEmail,
            contact: this.customerPhone
        },
        handler: (response: any) => {
            console.log('Payment Success:', response);
            alert('Payment Successful');
        },
        modal: {
            ondismiss: () => {
                console.log('Payment popup closed');
            }
        }
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
}
}

