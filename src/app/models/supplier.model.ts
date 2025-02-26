export interface Supplier {
    _id: string;
    name: string;
    phoneNumber: number;
    address: string;
    product: Array<{
      _id: string;
      productId: string;
      name: string;
      price: number;
    }>;
  }