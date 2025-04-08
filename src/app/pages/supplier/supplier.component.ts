// supplier.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { SnackbarService, SnackbarConfig } from '../../services/snackbar.service';
import { Supplier } from '../../models/supplier.model';
import { ApiResponse } from '../../models/apiResponse.model';
import { SnackbarComponent } from '../../layout/component/snackbar/snackbar.component';
import { AddDialogComponent, Field } from '../../layout/component/add-dialog/add-dialog.component';
import { EditDialogComponent } from '../../layout/component/edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../../layout/component/delete-dialog/delete-dialog.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { Subscription } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-Supplier',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    SnackbarComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    InputText,
    AddDialogComponent,
    TableModule,
    TagModule,
    ToastModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
  ],
  providers: [MessageService],
  templateUrl: './supplier.component.html',
})
export class SupplierComponent implements OnInit, OnDestroy {
  suppliers: Supplier[] = [];
  loading: boolean = true;
  selectedSupplier: Supplier | null = null;
  editDialogVisible: boolean = false;
  deleteDialogVisible: boolean = false;
  SupplierToDelete: Supplier | null = null;
  addDialogVisible: boolean = false;
  snackbarVisible: boolean = false;
  loadingCategories: boolean = true;
  selectedSupplierForProduct: Supplier | null = null;
  addProductDialogVisible: boolean = false;
  expandedRows: { [key: string]: boolean } = {};
  snackbarConfig: SnackbarConfig = {
    type: 'success',
    title: '',
    message: '',
    duration: 3000,
  };

  SupplierEditFields: Field[] = [
    { name: 'name', label: 'Name', type: 'text', required: true, pattern: '^(?!\\s*$)[a-zA-Z\\s]+$' },
    { name: 'phoneNumber', label: 'Mobile Number', type: 'tel', required: true, pattern: '^[0-9]{10}$' },
    { name: 'address', label: 'Address', type: 'text', required: true },
  ];

  SupplierAddFields: Field[] = [
    { name: 'name', label: 'Name', type: 'text', required: true, pattern: '^(?!\\s*$)[a-zA-Z\\s]+$' },
    { name: 'phoneNumber', label: 'Mobile Number', type: 'tel', required: true, pattern: '^[0-9]{10}$' },
    { name: 'address', label: 'Address', type: 'text', required: true },
  ];

  productAddFields: Field[] = [
    { name: 'name', label: 'Product Name', type: 'text', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true },
  ];

  private snackbarSubscriptions: Subscription[] = [];

  constructor(
    private SupplierService: SupplierService,
    private snackbarService: SnackbarService,
    private messageService: MessageService
  ) {
    this.expandedRows = {};
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  ngOnDestroy(): void {
    this.snackbarSubscriptions.forEach((sub) => sub.unsubscribe());
    this.snackbarService.hideSnackbar();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.SupplierService.getAllSupplier().subscribe({
      next: (response: ApiResponse) => {
        this.suppliers = response.data.map((supplier: any) => ({
          ...supplier,
          product: supplier.product
            ? supplier.product.map((p: any) => ({
                name: p.name,
                price: p.price,
                productId: p.productId,
                _id: p._id,
              }))
            : [],
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.loading = false;
        this.snackbarService.showError('Error', 'Failed to load suppliers. Please try again!');
      },
    });
  }

  expandAll() {
    this.expandedRows = this.suppliers.reduce((acc: { [key: string]: boolean }, s) => {
      this.fetchUniqueProducts(s);
      acc[s._id] = true;
      return acc;
    }, {});
  }

  collapseAll() {
    this.expandedRows = {};
  }

  onRowExpand(event: TableRowExpandEvent) {
    const supplier = event.data as Supplier;
    this.fetchUniqueProducts(supplier);
    this.messageService.add({
      severity: 'info',
      summary: 'Supplier Expanded',
      detail: supplier.name,
      life: 3000
    });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    const supplier = event.data as Supplier;
    this.messageService.add({
      severity: 'success',
      summary: 'Supplier Collapsed',
      detail: supplier.name,
      life: 3000
    });
  }

  openAddDialog(): void {
    this.addDialogVisible = true;
  }

  fetchUniqueProducts(supplier: Supplier) {
    if (!supplier.product || supplier.product.length === 0) {
      this.SupplierService.getProductOfSupplier(supplier._id).subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            supplier.product = response.data.map((item: any) => ({
              _id: item.ProductId,
              name: item.ProductName,
              price: item.BuyingPrice,
            }));
          }
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          supplier.product = [];
          this.snackbarService.showError('Error', 'Failed to fetch products for this supplier.');
        },
      });
    }
  }

  createSupplier(Supplier: Supplier): void {
    this.SupplierService.createSupplier(Supplier).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadSuppliers();
          this.addDialogVisible = false;
          this.snackbarService.showSuccess('Supplier Created', 'The Supplier has been added successfully!');
        }
      },
      error: (error) => {
        console.error('Error creating Supplier:', error);
        this.snackbarService.showError('Error', 'Failed to create Supplier. Please try again!');
      },
    });
  }

  openEditDialog(Supplier: Supplier): void {
    this.selectedSupplier = { ...Supplier };
    this.editDialogVisible = true;
  }

  updateSupplier(updatedSupplier: any): void {
    if (!this.selectedSupplier || !this.selectedSupplier._id) return;

    const supplierData = {
      ...updatedSupplier,
      _id: this.selectedSupplier._id,
    };

    this.SupplierService.updateSupplier({
      supplier: supplierData,
      _id: this.selectedSupplier._id,
    }).subscribe({
      next: () => {
        this.loadSuppliers();
        this.editDialogVisible = false;
        this.snackbarService.showSuccess('Supplier Updated', 'The Supplier has been updated successfully!');
      },
      error: (error) => {
        console.error('Error updating supplier:', error);
        this.snackbarService.showError('Update Failed', 'There was an error updating the supplier.');
      },
    });
  }

  openDeleteDialog(Supplier: Supplier): void {
    this.SupplierToDelete = Supplier;
    this.deleteDialogVisible = true;
  }

  confirmDelete(): void {
    if (!this.SupplierToDelete || !this.SupplierToDelete._id) return;

    this.SupplierService.deleteSupplier(this.SupplierToDelete._id).subscribe({
      next: () => {
        this.loadSuppliers();
        this.SupplierToDelete = null;
        this.deleteDialogVisible = false;
        this.snackbarService.showSuccess('Supplier Deleted', 'The Supplier has been removed successfully!');
      },
    });
  }

  openAddProductDialog(supplier: Supplier): void {
    this.selectedSupplierForProduct = supplier;
    this.addProductDialogVisible = true;
  }

  createProduct(product: any): void {
    if (!this.selectedSupplierForProduct || !this.selectedSupplierForProduct._id) {
      console.error('No supplier selected to add product to.');
      this.snackbarService.showError('Error', 'No supplier selected.');
      return;
    }

    const supplierId = this.selectedSupplierForProduct._id;
    const productData = { ...product };

    this.SupplierService.addProductToSupplier(supplierId, productData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadSuppliers();
          this.addProductDialogVisible = false;
          this.selectedSupplierForProduct = null;
          this.snackbarService.showSuccess('Product Added', 'The product has been added successfully!');
        }
      },
      error: (error) => {
        console.error('Error adding product:', error);
        this.snackbarService.showError('Error', 'Failed to add product. Please try again!');
      },
    });
  }

  openEditProductDialog(product: any): void {
    console.log('Edit product:', product);
  }
}