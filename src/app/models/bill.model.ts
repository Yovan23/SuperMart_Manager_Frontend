export interface Bill {
  success: any;
  data: any;
  message: string;
  _id: string;
  billNumber: string;
  cashierId: string;
  cashierName: string;
  customerDetails: {
    phone?: string;
    email?: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    tax?: number;
    subtotal: number;
  }>;
  paymentDetails: {
    method: 'CASH' | 'CARD' | 'UPI' | 'OTHER';
    upiId?: string;
  };
  subtotal: number;
  tax: number;
  totalDiscount?: number;
  totalAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
