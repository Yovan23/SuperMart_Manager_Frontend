import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Bill } from '../../models/bill.model';
import { BillService } from '../../services/bill.service';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';

interface PaymentMethod {
    label: string;
    value: string;
    icon: string;
}

@Component({
    selector: 'app-bill',
    standalone: true,
    imports: [FormsModule, InputTextModule, ButtonModule, CommonModule, CheckboxModule, ToastModule, SelectModule, DialogModule],
    templateUrl: './bill.component.html',
    styleUrl: './bill.component.css',
    providers: [MessageService]
})
export class BillComponent implements OnInit {
    bill: Bill[] = [];
    customerPhone: string = '';
    customerEmail: string = '';
    submittedBill: Bill | null = null;
    barcode: string = '';
    quantity: number = 1;
    paymentMethods: PaymentMethod[] = [
        { label: 'Cash', value: 'CASH', icon: 'pi pi-money-bill' },
        { label: 'UPI', value: 'UPI', icon: 'pi pi-mobile' },
    ];
    currentYear: number = new Date().getFullYear();
    selectedPaymentMethod: PaymentMethod | null = this.paymentMethods[0];
    invoiceDialogVisible: boolean = false;

    @ViewChild('itemInput') itemInput!: ElementRef;

    constructor(private billService: BillService, private messageService: MessageService) { }

    ngOnInit(): void { }

    createBill(): void {
        if (!this.customerPhone && !this.customerEmail) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Enter either phone or email' });
            return;
        }

        this.billService.createBill({ phone: this.customerPhone, email: this.customerEmail }).subscribe({
            next: (response: any) => {
                if (response.success) {
                    this.bill.push(response.data);
                    this.submittedBill = response.data;
                    setTimeout(() => {
                        this.itemInput.nativeElement.focus();
                    }, 10);
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Bill creation failed' });
                }
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create bill' });
            }
        });
    }

    addProductToBill(): void {
        var barcode = (document.getElementById('barcode') as HTMLInputElement).value;
    
        if (!this.submittedBill) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Create a bill first' });
            return;
        }

        if (!barcode) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Enter a valid barcode' });
            return;
        }

        const productData = {
            billId: this.submittedBill._id,
            barcode
        };

        this.billService.addProductToBill(productData).subscribe({
            next: (response: any) => {
                if (response.success) {
                    if (this.submittedBill) {
                        this.submittedBill = {
                            ...this.submittedBill,
                            items: response.data.items,
                            totalAmount: response.data.totalAmount,
                            subtotal: response.data.subtotal
                        };
                    }
                    barcode = (document.getElementById('barcode') as HTMLInputElement).value = '';
                    this.quantity = 1;

                    setTimeout(() => {
                        this.itemInput.nativeElement.focus();
                    }, 10);
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add product' });
                }
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Enter Valid barcode' });
            }
        });
    }


    processPayment(): void {
        if (!this.submittedBill) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Create a bill first' });
            return;
        }

        if (!this.selectedPaymentMethod) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Select Payment Method' });
            return;
        }

        const paymentDetails = {
            method: this.selectedPaymentMethod.value,
        };

        this.billService.addPaymentToBill({ billId: this.submittedBill._id, paymentDetails }).subscribe({
            next: (response: any) => {
                if (response && response.success) {
                    if (this.selectedPaymentMethod && this.selectedPaymentMethod.value === 'CASH') {
                        this.messageService.add({ severity: 'success', summary: 'Payment Successful', detail: 'Payment received in Cash' });
                        this.resetBillData();
                        return;
                    } else {
                    this.openRazorpayPayment(response.data);
                    }
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Payment failed:' });
                }
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Payment failed:' + error.message });
            }
        });
    }

    openRazorpayPayment(paymentData: any) {
        const options: any = {
            key: paymentData.key, 
            amount: paymentData.amount, 
            currency: paymentData.currency,
            name: 'Supermarket Manager',
            description: 'Test Transaction',
            order_id: paymentData.orderId,
            prefill: {
                email: this.customerEmail,
                contact: this.customerPhone
            },
            handler: (response: any) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Payment Success:' });
                this.resetBillData();   
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

    applyDiscount(): void {
        if (this.submittedBill) {
        const discount = parseFloat((document.getElementById('totalDiscount') as HTMLInputElement).value);
        if (!discount) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Enter a valid discount' });
            return;
        }
        console.log(discount);
        this.billService.addDiscountToBill({ discount: discount, billId: this.submittedBill?._id }).subscribe({
            next: (response: any) => {
                if (response.success) {
                    if (this.submittedBill) {
                        this.submittedBill = {
                            ...this.submittedBill,
                            totalDiscount: response.data.totalDiscount,
                            totalAmount: response.data.totalAmount,
                            subtotal: response.data.subtotal
                        };
                    }
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Discount applied successfully' });
                    (document.getElementById('totalDiscount') as HTMLInputElement).value = discount.toString();
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to apply discount' });
                }
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to apply discount' });
            }
        }
        );
        }
        }
    resetBillData(): void {
        this.customerPhone = '';
        this.customerEmail = '';
        this.barcode = '';
        this.quantity = 1;
        this.selectedPaymentMethod = this.paymentMethods[0]; 
        this.submittedBill = null;
    }

    showInvoiceDialog(): void {
        console.log(this.submittedBill);
        this.invoiceDialogVisible = true;
    }

    printInvoice(): void {
        const invoiceElement = document.getElementById('invoice-content');
    
        if (invoiceElement) {
            const printWindow = window.open('', '', 'width=800,height=600');
            if (printWindow) {
                printWindow.document.write(invoiceElement.innerHTML);
                printWindow.document.close();
                printWindow.print();
                printWindow.onafterprint = () => {
                    printWindow.close(); 
                };
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to open print window.' });
            }
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not find invoice content.' });
        }
    }    
}

