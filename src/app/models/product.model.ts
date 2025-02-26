export interface Product {
    _id: string;
    name: string;
    description: string;
    categoryId: string;
    quantity: number;
    price: number;
    volume: number;
    unit: string;
    barcode: number;
    isVisible: boolean;
    isDeleted: boolean;
  }