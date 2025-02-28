import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { SnackbarService, SnackbarConfig } from '../../services/snackbar.service';
import { Category } from '../../models/category.model';
import { ApiResponse } from '../../models/apiResponse.model';
import { SnackbarComponent } from '../../layout/component/snackbar/snackbar.component';
import { AddDialogComponent, Field } from '../../layout/component/add-dialog/add-dialog.component';
import { EditDialogComponent } from '../../layout/component/edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from '../../layout/component/delete-dialog/delete-dialog.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Subscription } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    SnackbarComponent,
    EditDialogComponent,
    DeleteDialogComponent,
    AddDialogComponent,
    TableModule, // Includes p-table and p-columnFilter
    CommonModule,
    TagModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    TooltipModule,
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  @ViewChild('dt') dt!: Table;

  category: Category[] = [];
  loading: boolean = true;
  selectedCategory: Category | null = null;
  editDialogVisible: boolean = false;
  deleteDialogVisible: boolean = false;
  categoryToDelete: Category | null = null;
  addDialogVisible: boolean = false;
  snackbarVisible: boolean = false;
  selectedStatus: boolean | null = null;
  snackbarConfig: SnackbarConfig = {
    type: 'success',
    title: '',
    message: '',
    duration: 3000,
  };
  statuses: any[] = [
    { label: 'Visible', value: true },
    { label: 'Hidden', value: false },
  ];

  categoryEditFields: Field[] = [
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
      name: 'isVisible',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Visible', value: true },
        { label: 'Hidden', value: false },
      ],
      required: true,
    },
  ];
  categoryAddFields: Field[] = [
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
  ];
  private snackbarSubscriptions: Subscription[] = [];

  constructor(
    private categoryService: CategoryService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadcategory();
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
  }

  ngOnDestroy(): void {
    this.snackbarSubscriptions.forEach((sub) => sub.unsubscribe());
    this.snackbarService.hideSnackbar();
  }

  loadcategory(): void {
    this.loading = true;
    this.categoryService.getAllCategory().subscribe({
      next: (response: ApiResponse) => {
        this.category = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.loading = false;
      },
    });
  }

  openAddDialog(): void {
    this.addDialogVisible = true;
  }

  createCategory(category: Category): void {
    this.categoryService.createCategory(category).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadcategory();
          this.addDialogVisible = false;
          this.snackbarService.showSuccess(
            'Category Created',
            'The category has been added successfully!'
          );
        }
      },
      error: (error) => {
        console.error('Error creating category:', error);
        this.snackbarService.showError(
          'Error',
          'Failed to create category. Please try again!'
        );
      },
    });
  }

  openEditDialog(category: Category): void {
    this.selectedCategory = { ...category };
    this.editDialogVisible = true;
  }

  updateCategory(updatedCategory: any): void {
    if (!this.selectedCategory || !this.selectedCategory._id) return;

    this.categoryService
      .updateCategory({
        category: updatedCategory,
        _id: this.selectedCategory._id,
      })
      .subscribe({
        next: () => {
          this.loadcategory();
          this.editDialogVisible = false;
          this.snackbarService.showSuccess(
            'Category Updated',
            'Category details updated successfully!'
          );
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.snackbarService.showError(
            'Error',
            'Failed to update category. Please try again!'
          );
        },
      });
  }

  openDeleteDialog(category: Category): void {
    this.categoryToDelete = category;
    this.deleteDialogVisible = true;
  }

  confirmDelete(): void {
    if (!this.categoryToDelete || !this.categoryToDelete._id) return;

    this.categoryService.deleteCategory(this.categoryToDelete._id).subscribe({
      next: () => {
        this.loadcategory();
        this.categoryToDelete = null;
        this.deleteDialogVisible = false;
        this.snackbarService.showSuccess(
          'Category Deleted',
          'The category has been removed successfully!'
        );
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.snackbarService.showError(
          'Error',
          'Failed to delete category. Please try again!'
        );
      },
    });
  }

  getSeverity(isVisible: boolean): 'success' | 'danger' {
    return isVisible ? 'success' : 'danger';
  }
}