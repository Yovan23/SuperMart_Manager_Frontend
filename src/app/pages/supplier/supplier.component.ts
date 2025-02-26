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
        CommonModule,
        TagModule,
        ButtonModule
    ],
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
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            required: true,
            pattern: '^(?!\\s*$)[a-zA-Z\\s]+$', 
        },
        {
            name: 'phoneNumber',
            label: 'Mobile Number',
            type: 'tel',
            required: true,
            pattern: '^[0-9]{10}$',
        },
        {
            name: 'address',
            label: 'Address',
            type: 'text',
            required: true,
        },
    ];

    SupplierAddFields: Field[] = [
            {
                name: 'name',
                label: 'Name',
                type: 'text',
                required: true,
                pattern: '^(?!\\s*$)[a-zA-Z\\s]+$',
            },
            {
                name: 'phoneNumber',
                label: 'Mobile Number',
                type: 'tel',
                required: true,
                pattern: '^[0-9]{10}$',
            },
            {
                name: 'address',
                label: 'Address',
                type: 'text',
                required: true,
            },
    ];
    productAddFields: Field[] = [
        {
            name: 'name',
            label: 'Product Name',
            type: 'text',
            required: true,
        },
        {
            name: 'price',
            label: 'Price',
            type: 'number',
            required: true,
        },
    ];

    private snackbarSubscriptions: Subscription[] = [];

    constructor(
        private SupplierService: SupplierService,
        private snackbarService: SnackbarService,
    ) {
        this.expandedRows = {};
    }

    ngOnInit(): void {
        this.loadSuppliers();
    }

    ngOnDestroy(): void {
        this.snackbarSubscriptions.forEach(sub => sub.unsubscribe());
        this.snackbarService.hideSnackbar();
    }

    loadSuppliers(): void {
        this.loading = true;
        this.SupplierService.getAllSupplier().subscribe({
            next: (response: ApiResponse) => {
                this.suppliers = response.data.map((supplier: any) => ({
                    ...supplier,
                    product: supplier.product ? supplier.product.map((p: any) => ({
                        name: p.name,
                        price: p.price,
                        productId: p.productId,
                        _id: p._id
                    })) : []
                }));
                this.loading = false;
                console.log('Loaded suppliers:', this.suppliers);
            },
            error: (error) => {
                console.error('Error loading suppliers:', error);
                this.loading = false;
                this.snackbarService.showError(
                    'Error',
                    'Failed to load suppliers. Please try again!'
                );
            }
        });
    }

    openAddDialog(): void {
        this.addDialogVisible = true;
    }

    createSupplier(Supplier: Supplier): void {
        this.SupplierService.createSupplier(Supplier).subscribe({
            next: (response: any) => {
                if (response.success) {
                    this.loadSuppliers();
                    this.addDialogVisible = false;
                    this.snackbarService.showSuccess(
                        'Supplier Created',
                        'The Supplier has been added successfully!'
                    );
                }
            },
            error: (error) => {
                console.error('Error creating Supplier:', error);
                console.log(error);
                this.snackbarService.showError(
                    'Error',
                    'Failed to create Supplier. Please try again!'
                );
            }
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
        _id: this.selectedSupplier._id  
    };

    this.SupplierService.updateSupplier({ supplier: supplierData, _id: this.selectedSupplier._id }).subscribe({
        next: () => {
            this.loadSuppliers();
            this.editDialogVisible = false;
            this.snackbarService.showSuccess(
                'Supplier Updated',
                'The Supplier has been updated successfully!'
            );
        },
        error: (error) => {
            console.error('Error updating supplier:', error);
            this.snackbarService.showError('Update Failed', 'There was an error updating the supplier.');
        }
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
                this.snackbarService.showSuccess(
                    'Supplier Deleted',
                    'The Supplier has been removed successfully!'
                );
            }
        });
    }

    toggleRow(supplier: Supplier) {
        if (this.expandedRows[supplier._id]) {
            delete this.expandedRows[supplier._id];
        } else {
            this.expandedRows[supplier._id] = true;
        }
        this.expandedRows = { ...this.expandedRows }; 
    }

    isExpanded(supplier: Supplier): boolean {
        return this.expandedRows[supplier._id] === true;
    }

    getProductNames(supplier: any): string {
        return supplier.product.map((p: any) => p.name).join(', ');
    }

    getSeverity(stock: number): 'success' | 'danger' {
        return stock > 0 ? 'success' : 'danger';
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
    
        // Include the supplierId in the product data being sent to the API.
        const productData = {
            ...product,  // Spread the product data (name, price)
        };
    
        this.SupplierService.addProductToSupplier(supplierId, productData).subscribe({
            next: (response: any) => {
                if (response.success) {
                    this.loadSuppliers();
                    this.addProductDialogVisible = false;
                    this.selectedSupplierForProduct = null;
                    this.snackbarService.showSuccess(
                        'Product Added',
                        'The product has been added successfully!'
                    );
                }
            },
            error: (error) => {
                console.error('Error adding product:', error);
                 this.snackbarService.showError(
                    'Error',
                    'Failed to add product. Please try again!'
                );
            }
        });
    }
    openEditProductDialog(product: any): void {
        // Implement logic to open the "Edit Product" dialog
        // You might want to create a new component for this dialog
        console.log('Edit product:', product);
    }
}