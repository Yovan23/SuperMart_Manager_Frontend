import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { SupplierService } from '../../services/supplier.service';
import { ProductService } from '../../services/product.service';
import { SnackbarService, SnackbarConfig } from '../../services/snackbar.service';
import { Stock } from '../../models/stock.model';
import { ApiResponse } from '../../models/apiResponse.model';
import { SnackbarComponent } from '../../layout/component/snackbar/snackbar.component';
import { AddDialogComponent, Field } from '../../layout/component/add-dialog/add-dialog.component';
import { EditDialogComponent } from '../../layout/component/edit-dialog/edit-dialog.component';
import { TableModule, Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    SnackbarComponent, 
    InputText, 
    AddDialogComponent, 
    EditDialogComponent,
    TableModule, 
    CommonModule, 
    TagModule, 
    ButtonModule
  ],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent  implements OnInit, OnDestroy {
  @ViewChild('dt') dt!: Table;
  stocks: Stock[] = [];
  loading: boolean = true;
  selectedStock: Stock | null = null;
  addDialogVisible: boolean = false;
  editDialogVisible: boolean = false
  snackbarVisible: boolean = false;
  snackbarConfig: SnackbarConfig = {
    type: 'success',
    title: '',
    message: '',
    duration: 3000,
  };

  stockAddFields: Field[] = [
    {
      name: 'ProductId',
      label: 'Product Name',
      type: 'autocomplete',
      required: true,
      options: [],
    },
    {
      name: 'qty',
      label: 'Quantity',
      type: 'number',
      required: true,
      pattern: '^[0-9]+$',
    },
    {
      name: 'buying_price',
      label: 'Buying Price',
      type: 'number',
      required: true,
      pattern: '^[0-9.]+$',
    },
    {
      name: 'supplierId',
      label: 'Supplier Name',
      type: 'select',
      required: true,
      options: [],
    },
    {
      name: 'expiryDate',
      label: 'Expiry Date',
      type: 'date',
      required: true,
      minDate: new Date(new Date().setDate(new Date().getDate())),
    },
  ];
  stockEditFields: Field[] = 
  [
    {
      name: 'ProductName',
      label: 'Product Name',
      type: 'autocomplete',
      required: true,
      options: [],
    },
    {
      name: 'qty',
      label: 'Quantity',
      type: 'number',
      required: true,
      pattern: '^[0-9]+$',
    },
    {
      name: 'buying_price',
      label: 'Buying Price',
      type: 'number',
      required: true,
      pattern: '^[0-9.]+$',
    },
    {
      name: 'supplierId',
      label: 'Supplier Name',
      type: 'select',
      required: true,
      options: [],
    },
    {
      name: 'expiryDate',
      label: 'Expiry Date',
      type: 'date',
      minDate: new Date(new Date().setDate(new Date().getDate())),
      required: true,
    },
   
  ];

  private snackbarSubscriptions: Subscription[] = [];
  loadingProducts: boolean = false;
  products: any;

  constructor(private stockService: StockService, private snackbarService: SnackbarService, private supplierService: SupplierService, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadStocks();
    this.loadSuppliers();
    this.loadProducts();
    this.snackbarSubscriptions.push(
      this.snackbarService.visible$.subscribe(
        visible => this.snackbarVisible = visible
      )
    );
    this.snackbarSubscriptions.push(
      this.snackbarService.config$.subscribe(
        config => this.snackbarConfig = config
      )
    );
  }
    ngOnDestroy(): void {
      this.snackbarSubscriptions.forEach(sub => sub.unsubscribe());
      this.snackbarService.hideSnackbar();
    }

    loadStocks(): void {
      this.loading = true;
      this.stockService.getAllStock().subscribe({
        next: (response: ApiResponse) => {
          this.stocks = response.data;
          console.log('Stocks:', this.stocks);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading category:', error);
          this.loading = false;
        }
      });
    }
    loadSuppliers(): void {
      this.supplierService.getAllSupplier().subscribe({
        next: (response: ApiResponse) => {
          this.stockAddFields[3].options = response.data.map((supplier: { name: string; _id: string }) => ({
            label: supplier.name,
            value: supplier._id,
          }));
          this.stockEditFields[3].options = response.data.map((supplier: { name: string; _id: string }) => ({
            label: supplier.name,
            value: supplier._id,
          }));
        },
        error: (error) => {
          console.error('Error loading suppliers:', error);
        }
      });
    }

    loadProducts(): void {
      this.productService.getAllProduct().subscribe({
        next: (response: ApiResponse) => {
          this.stockAddFields[0].options = response.data.map((product: { name: string; _id: string }) => ({
            label: product.name,
            value: product._id,
          }));
          this.stockEditFields[0].options = response.data.map((product: { name: string; _id: string }) => ({
            label: product.name,
            value: product._id,
            }));
        },
        error: (error) => {
          console.error('Error loading products:', error);
        }
      });
    }

    openAddDialog(): void {
      this.addDialogVisible = true;
    }

    createStock(stock: Stock): void {
      const stockData = {
          ...stock,
          ProductId: stock.ProductId?.valueOf() || stock.ProductId,  // Extract _id
          supplierId: stock.supplierId?.valueOf() || stock.supplierId // Extract _id
      };
      console.log(stockData);
      this.stockService.createStock(stockData).subscribe({
          next: (response: any) => {
              if (response.success) {
                  this.loadStocks();
                  this.addDialogVisible = false;
                  this.snackbarService.showSuccess(
                      'Stock Created',
                      'The stock has been added successfully!'
                  );
              }
          },
          error: (error) => {
              console.error('Error creating stock:', error);
              this.snackbarService.showError(
                  'Error',
                  'Failed to create stock. Please try again!'
              );
          }
      });
  }

  openEditDialog(stock: Stock): void {
    this.selectedStock = { ...stock };
  
    if (this.selectedStock.supplierId) {
      const supplier = this.selectedStock.supplierId as unknown as { _id: string };
      if (typeof supplier === 'object') {
        this.selectedStock.supplierId = supplier._id;
      }
    }
  
    if (this.selectedStock.ProductId) {
      const product = this.selectedStock.ProductId as unknown as { _id: string; name: string };
      if (typeof product === 'object') {
        this.selectedStock.ProductId = product._id;  
      }
    }
  
    if (this.selectedStock.expiryDate) {
      const date = new Date(this.selectedStock.expiryDate);
      this.selectedStock.expiryDate = new Date(date.toISOString().split('T')[0]); 
    }
  
    this.editDialogVisible = true;
  }
  

    updateStock({ stock, _id }: { stock: Stock; _id: string; }): void {
      this.stockService.updateStock({ stock, _id }).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.loadStocks();
            this.editDialogVisible = false;
            this.snackbarService.showSuccess(
              'Stock Updated',
              'The stock has been updated successfully!'
            );
          }
        },
        error: (error) => {
          console.error('Error updating stock:', error);
          this.snackbarService.showError(
            'Error',
            'Failed to update stock. Please try again!'
          );
        }
      });
    }

    applyFilter(event: Event, field: string) {
      const inputValue = (event.target as HTMLInputElement).value;
      this.dt.filter(inputValue, field, 'contains');
    }
}



// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { StockService } from '../../services/stock.service';
// import { SupplierService } from '../../services/supplier.service';
// import { ProductService } from '../../services/product.service';
// import { SnackbarService, SnackbarConfig } from '../../services/snackbar.service';
// import { Stock } from '../../models/stock.model';
// import { ApiResponse } from '../../models/apiResponse.model';
// import { SnackbarComponent } from '../../layout/component/snackbar/snackbar.component';
// import { AddDialogComponent, Field } from '../../layout/component/add-dialog/add-dialog.component';
// import { EditDialogComponent } from '../../layout/component/edit-dialog/edit-dialog.component';
// import { TableModule } from 'primeng/table';
// import { CommonModule } from '@angular/common';
// import { ButtonModule } from 'primeng/button';
// import { InputText } from 'primeng/inputtext';
// import { TagModule } from 'primeng/tag';
// import { Subscription } from 'rxjs';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-stock',
//   standalone: true,
//   imports: [
//     FormsModule,
//     ReactiveFormsModule,
//     SnackbarComponent,
//     InputText,
//     AddDialogComponent,
//     EditDialogComponent,
//     TableModule,
//     CommonModule,
//     TagModule,
//     ButtonModule
//   ],
//   templateUrl: './stock.component.html',
//   styleUrl: './stock.component.css'
// })
// export class StockComponent implements OnInit, OnDestroy {

//   stocks: Stock[] = [];
//   loading: boolean = true;
//   selectedStock: Stock | null = null;
//   addDialogVisible: boolean = false;
//   editDialogVisible: boolean = false
//   snackbarVisible: boolean = false;
//   snackbarConfig: SnackbarConfig = {
//     type: 'success',
//     title: '',
//     message: '',
//     duration: 3000,
//   };

//   stockAddFields: Field[] = [
//     {
//       name: 'ProductId',
//       label: 'Product Name',
//       type: 'select',
//       required: true,
//       options: [],
//     },
//     {
//       name: 'qty',
//       label: 'Quantity',
//       type: 'number',
//       required: true,
//       pattern: '^[0-9]+$',
//     },
//     {
//       name: 'buying_price',
//       label: 'Buying Price',
//       type: 'number',
//       required: true,
//       pattern: '^[0-9.]+$',
//     },
//     {
//       name: 'supplierId',
//       label: 'Supplier Name',
//       type: 'select',
//       required: true,
//       options: [],
//     },
//     {
//       name: 'expiryDate',
//       label: 'Expiry Date',
//       type: 'date',
//       required: true,
//     },
//   ];
//   stockEditFields: Field[] = [];

//   // Autocomplete related properties
//   filteredProducts: any[] = [];
//   selectedProduct: any = null;
//   products: any[] = [];

//   private snackbarSubscriptions: Subscription[] = [];

//   constructor(private stockService: StockService, private snackbarService: SnackbarService, private supplierService: SupplierService, private productService: ProductService) { }

//   ngOnInit(): void {
//     this.loadStocks();
//     this.loadSuppliers();
//     this.loadProducts();
//     this.snackbarSubscriptions.push(
//       this.snackbarService.visible$.subscribe(
//         visible => this.snackbarVisible = visible
//       )
//     );
//     this.snackbarSubscriptions.push(
//       this.snackbarService.config$.subscribe(
//         config => this.snackbarConfig = config
//       )
//     );
//   }
//   ngOnDestroy(): void {
//     this.snackbarSubscriptions.forEach(sub => sub.unsubscribe());
//     this.snackbarService.hideSnackbar();
//   }

//   loadStocks(): void {
//     this.loading = true;
//     this.stockService.getAllStock().subscribe({
//       next: (response: ApiResponse) => {
//         this.stocks = response.data;
//         console.log('Stocks:', this.stocks);
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Error loading category:', error);
//         this.loading = false;
//       }
//     });
//   }
//   loadSuppliers(): void {
//     this.supplierService.getAllSupplier().subscribe({
//       next: (response: ApiResponse) => {
//         this.stockAddFields[3].options = response.data.map((supplier: { name: string; _id: string }) => ({
//           label: supplier.name,
//           value: supplier._id,
//         }));
//       },
//       error: (error) => {
//         console.error('Error loading suppliers:', error);
//       }
//     });
//   }

//   loadProducts(): void {
//     this.productService.getAllProduct().subscribe({
//       next: (response: ApiResponse) => {
//         this.products = response.data;  // Load products to local array
//       },
//       error: (error) => {
//         console.error('Error loading products:', error);
//       }
//     });
//   }

//   openAddDialog(): void {
//     this.addDialogVisible = true;
//   }

//   // Modified createStock Method
//   createStock(stock: any): void { // Removed the stock type to any, as we handle type inside method
//     if (this.selectedProduct) {
//       stock.ProductId = this.selectedProduct._id; // Use the selected product's ID

//       this.stockService.createStock(stock).subscribe({
//         next: (response: any) => {
//           if (response.success) {
//             this.loadStocks();
//             this.addDialogVisible = false;
//             this.selectedProduct = null; // Reset the selected product
//             this.filteredProducts = []; // Clear the filter Products
//             this.snackbarService.showSuccess(
//               'Stock Created',
//               'The stock has been added successfully!'
//             );
//           }
//         },
//         error: (error) => {
//           console.error('Error creating stock:', error);
//           this.snackbarService.showError(
//             'Error',
//             'Failed to create stock. Please try again!'
//           );
//         }
//       });
//     } else {
//       this.snackbarService.showError(
//         'Error',
//         'Please select a product from the autocomplete list.'
//       );
//     }
//   }

//   openEditDialog(stock: Stock): void {
//     this.selectedStock = { ...stock };
//     this.editDialogVisible = true;
//   }

//   updateStock({ stock, _id }: { stock: Stock; _id: string; }): void {
//     this.stockService.updateStock({ stock, _id }).subscribe({
//       next: (response: any) => {
//         if (response.success) {
//           this.loadStocks();
//           this.editDialogVisible = false;
//           this.snackbarService.showSuccess(
//             'Stock Updated',
//             'The stock has been updated successfully!'
//           );
//         }
//       },
//       error: (error) => {
//         console.error('Error updating stock:', error);
//         this.snackbarService.showError(
//           'Error',
//           'Failed to update stock. Please try again!'
//         );
//       }
//     });
//   }

//   getSupplierName(supplierId: string): string {
//     const supplier = this.stockAddFields[3].options?.find(
//       (supplier: { value: string; }) => supplier.value === supplierId
//     );
//     return supplier ? supplier.label : '';
//   }

//   // Autocomplete method
//   filterProduct(event: any) {
//     const query = event.query;
//     this.filteredProducts = this.products.filter(product =>
//       product.name.toLowerCase().includes(query.toLowerCase())
//     );
//   }
// }