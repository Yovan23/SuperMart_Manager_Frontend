export interface Stock {
    _id: string;
    ProductId: string;
    qty: number;
    buying_price: number;
    expiryDate: Date;
    addedBy?: string; 
    supplierId: string; 
    createdAt?: Date;
    updatedAt?: Date; 
  }