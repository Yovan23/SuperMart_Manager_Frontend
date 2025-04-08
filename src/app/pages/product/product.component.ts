import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import {
  SnackbarService,
  SnackbarConfig,
} from '../../services/snackbar.service';
import { Product } from '../../models/product.model';
import { ApiResponse } from '../../models/apiResponse.model';
import { SnackbarComponent } from '../../layout/component/snackbar/snackbar.component';
import {
  AddDialogComponent,
  Field,
} from '../../layout/component/add-dialog/add-dialog.component';
import { EditDialogComponent } from '../../layout/component/edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../../layout/component/delete-dialog/delete-dialog.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { Subscription } from 'rxjs';
import { BadgeModule } from 'primeng/badge';
import { Table } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    SnackbarComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    InputTextModule,
    AddDialogComponent,
    TableModule,
    CommonModule,
    TagModule,
    ButtonModule,
    BadgeModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {
  @ViewChild('dt') dt!: Table;
  products: Product[] = [];
  cols!: Column[];
  selectedProducts: Product[] = [];
  categories: any[] = [];
  exportColumns!: ExportColumn[];
  loading: boolean = true;
  selectedProduct: Product | null = null;
  editDialogVisible: boolean = false;
  deleteDialogVisible: boolean = false;
  productToDelete: Product | null = null;
  addDialogVisible: boolean = false;
  snackbarVisible: boolean = false;
  loadingCategories: boolean = true;
  snackbarConfig: SnackbarConfig = {
    type: 'success',
    title: '',
    message: '',
    duration: 3000,
  };

  stockSeverity(product: Product) {
    if (product.quantity === 0) return 'danger';
    else if (product.quantity > 0 && product.quantity <= 15) return 'warn';
    else return 'success';
  }

  productEditFields: Field[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      pattern: '^(?!\\s*$)[a-zA-Z\\s]+$',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      required: true,
      pattern: '^[1-9][0-9]*$',
    },
    {
      name: 'tax',
      label: 'Tax(%)',
      type: 'number',
      pattern: '^[1-9][0-9]*$',
    },
    {
      name: 'categoryId',
      label: 'Category',
      type: 'select',
      required: true,
      options: [],
    },
    {
      name: 'volume',
      label: 'Volume',
      type: 'number',
      required: true,
      pattern: '^[1-9][0-9]*$',
    },
    {
      name: 'unit',
      label: 'Unit',
      type: 'select',
      required: true,
      options: [
        { label: 'Select Unit', value: '' },
        { label: 'g', value: 'g' },
        { label: 'kg', value: 'kg' },
        { label: 'ml', value: 'ml' },
        { label: 'l', value: 'l' },
        { label: 'pcs', value: 'pcs' },
      ],
    },
    {
      name: 'isVisible',
      label: 'Is Visible',
      type: 'select',
      options: [
        { label: 'Visible', value: true },
        { label: 'Hidden', value: false },
      ],
      required: true,
    },
  ];

  productAddFields: Field[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      pattern: '^(?!\\s*$)[a-zA-Z\\s]+$',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      required: true,
      pattern: '^[1-9][0-9]*$',
    },
    {
      name: 'tax',
      label: 'Tax(%)',
      type: 'number',
      pattern: '^[1-9][0-9]*$',
    },
    {
      name: 'categoryId',
      label: 'Category',
      type: 'select',
      required: true,
      options: [],
    },
    {
      name: 'volume',
      label: 'Volume',
      type: 'number',
      required: true,
      pattern: '^[1-9][0-9]*$',
    },
    {
      name: 'unit',
      label: 'Unit',
      type: 'select',
      required: true,
      options: [
        { label: 'Select Unit', value: '' },
        { label: 'g', value: 'g' },
        { label: 'kg', value: 'kg' },
        { label: 'ml', value: 'ml' },
        { label: 'l', value: 'l' },
        { label: 'pcs', value: 'pcs' },
      ],
    },
  ];

  private snackbarSubscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();

    this.snackbarSubscriptions.push(
      this.snackbarService.visible$.subscribe(
        (visible) => (this.snackbarVisible = visible)
      )
    );

    this.snackbarSubscriptions.push(
      this.snackbarService.config$.subscribe(
        (config) => (this.snackbarConfig = config)
      )
    );

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: 'categoryId', header: 'Category' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'price', header: 'Price' },
      { field: 'barcode', header: 'Barcode' },
      { field: 'volume', header: 'Volume' },
      { field: 'unit', header: 'Unit' },
      { field: 'isVisible', header: 'Visibility' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  ngOnDestroy(): void {
    this.snackbarSubscriptions.forEach((sub) => sub.unsubscribe());
    this.snackbarService.hideSnackbar();
  }

  loadCategories(): void {
    this.categoryService.getAllCategory().subscribe({
      next: (response: ApiResponse) => {
        this.categories = response.data;

        const categoryOptions = this.categories
          .filter((category) => category.isVisible)
          .map((category) => ({
            label: category.name,
            value: category._id,
          }));

        const categoryFieldIndex = 4;
        if (this.productAddFields[categoryFieldIndex]) {
          this.productAddFields[categoryFieldIndex].options = categoryOptions;
        }
        if (this.productEditFields[categoryFieldIndex]) {
          this.productEditFields[categoryFieldIndex].options = categoryOptions;
        }

        this.loadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loadingCategories = false;
      },
    });
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (this.dt) {
      if (selectedValue === '') {
        this.dt.filter(null, 'categoryId', 'equals');
      } else {
        this.dt.filter(selectedValue, 'categoryId', 'equals');
      }
    }
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProduct().subscribe({
      next: (response: ApiResponse) => {
        this.products = response.data.map((product: any) => ({
          ...product,
          categoryId: product.categoryId?._id || product.categoryId,
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      },
    });
  }

  openAddDialog(): void {
    this.addDialogVisible = true;
  }

  createProduct(product: Product): void {
    this.productService.createProduct(product).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadProducts();
          this.addDialogVisible = false;
          this.snackbarService.showSuccess(
            'Product Created',
            'The product has been added successfully!'
          );
        }
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.snackbarService.showError(
          'Error',
          'Failed to create product. Please try again!'
        );
      },
    });
  }

  openEditDialog(product: Product): void {
    this.selectedProduct = { ...product };
    if (this.selectedProduct && this.selectedProduct.categoryId) {
      const categoryId = this.selectedProduct.categoryId as any;
      if (typeof categoryId === 'object' && categoryId._id) {
        this.selectedProduct.categoryId = categoryId._id;
      }
    }
    this.editDialogVisible = true;
  }

  updateProduct(updatedProduct: any): void {
    if (!this.selectedProduct || !this.selectedProduct._id) return;

    this.productService
      .updateProduct({ Product: updatedProduct, _id: this.selectedProduct._id })
      .subscribe({
        next: () => {
          this.loadProducts();
          this.editDialogVisible = false;
          this.snackbarService.showSuccess(
            'Product Updated',
            'Product details updated successfully!'
          );
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.snackbarService.showError(
            'Error',
            'Failed to update product. Please try again!'
          );
        },
      });
  }

  openDeleteDialog(product: Product): void {
    this.productToDelete = product;
    this.deleteDialogVisible = true;
  }

  confirmDelete(): void {
    if (!this.productToDelete || !this.productToDelete._id) return;

    this.productService.deleteProduct(this.productToDelete._id).subscribe({
      next: () => {
        this.loadProducts();
        this.productToDelete = null;
        this.deleteDialogVisible = false;
        this.snackbarService.showSuccess(
          'Product Deleted',
          'The product has been removed successfully!'
        );
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.snackbarService.showError(
          'Error',
          'Failed to delete product. Please try again!'
        );
      },
    });
  }

  getCategoryName(categoryId: any): string {
    if (!categoryId) return 'Unknown';
    const categoryIdStr =
      typeof categoryId === 'object' ? categoryId._id : categoryId;
    const category = this.categories.find(
      (cat) => String(cat._id) === String(categoryIdStr)
    );
    return category ? category.name : 'Unknown';
  }

  getSeverity(isVisible: boolean): 'success' | 'danger' {
    return isVisible ? 'success' : 'danger';
  }
}