import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { SnackbarConfig, SnackbarService } from '../../services/snackbar.service';
import { Bill } from '../../models/bill.model';
import { ApiResponse } from '../../models/apiResponse.model';
import { Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    InputText,
    TagModule,
    BadgeModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule
  ],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Added to fix the 'multiple' property binding error
})
export class TransactionComponent implements OnInit, OnDestroy {
  @ViewChild('dt')
  dt!: Table;

  bills: Bill[] = [];
  initialBills: Bill[] = [];
  cols: Column[] = [];
  visibleCols: Column[] = [];
  selectedColumns: Column[] = [];
  selectedBills: Bill[] = [];
  exportColumns!: ExportColumn[];
  loading: boolean = true;
  selectedBill: Bill | null = null;
  viewDialogVisible: boolean = false;
  startDate: Date | null = null;
  endDate: Date | null = null;
  sortState: { [key: string]: boolean | null } = {};

  snackbarConfig: SnackbarConfig = {
    type: 'success',
    title: '',
    message: '',
    duration: 3000,
  };

  private snackbarSubscriptions: Subscription[] = [];
  snackbarVisible!: boolean;

  constructor(
    private billService: BillService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadBills();
    this.initializeColumns();
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

  initializeColumns(): void {
    this.cols = [
      { field: 'billNumber', header: 'Bill' },
      { field: 'cashierName', header: 'Cashier' },
      { field: 'customerDetails.phone', header: 'Customer' },
      { field: 'totalAmount', header: 'Amount' },
      { field: 'status', header: 'Status' },
      { field: 'createdAt', header: 'Date' }
    ];
    this.visibleCols = [...this.cols];
    this.selectedColumns = [...this.cols];
    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
    this.cols.forEach(col => this.sortState[col.field] = null);
  }

  updateVisibleColumns(): void {
    this.visibleCols = this.selectedColumns.length > 0 ? [...this.selectedColumns] : [...this.cols];
  }

  ngOnDestroy(): void {
    this.snackbarSubscriptions.forEach((sub) => sub.unsubscribe());
    this.snackbarService.hideSnackbar();
  }

  loadBills(): void {
    this.loading = true;
    const params: { startDate?: string; endDate?: string; status?: string } = {};
    
    if (this.startDate) {
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);
      params.startDate = start.toISOString().split('T')[0];
    }
    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);
      params.endDate = end.toISOString().split('T')[0];
    }

    this.billService.getAllBill(params).subscribe({
      next: (response: ApiResponse) => {
        this.bills = response.data.reverse();
        this.initialBills = [...this.bills];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bills:', error);
        this.loading = false;
        this.snackbarService.showError(
          'Error',
          'Failed to load transactions. Please try again!'
        );
      },
    });
  }

  customSort(event: SortEvent): void {
    const field = event.field as string; // Type assertion
    if (this.sortState[field] === null) {
      this.sortState[field] = true;
      this.sortTableData(event);
    } else if (this.sortState[field] === true) {
      this.sortState[field] = false;
      this.sortTableData(event);
    } else if (this.sortState[field] === false) {
      this.sortState[field] = null;
      this.bills = [...this.initialBills];
      this.dt.reset();
    }
  }

  sortTableData(event: SortEvent): void {
    if (!event.data || event.field === undefined || event.order === undefined) {
      return;
    }

    event.data.sort((data1, data2) => {
      const value1 = this.resolveFieldData(data1, event.field!);
      const value2 = this.resolveFieldData(data2, event.field!);
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order! * result;
    });
  }

  resolveFieldData(data: any, field: string): any {
    if (field.includes('.')) {
      const fields = field.split('.');
      let value = data;
      for (let f of fields) {
        value = value ? value[f] : null;
      }
      return value;
    }
    return data[field];
  }

  // Rest of the methods remain unchanged
  openViewDialog(bill: Bill): void {
    this.selectedBill = { ...bill };
    this.viewDialogVisible = true;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  applyGlobalFilter(event: Event, dt: Table): void {
    const filterValue = (event.target as HTMLInputElement).value?.trim().toLowerCase();
    if (!dt) return;
    dt.filterGlobal(filterValue, 'contains');
  }

  applyDateFilter(dt: Table): void {
    this.loadBills();
    dt.reset();
  }

  clearFilters(): void {
    this.startDate = null;
    this.endDate = null;
    this.loadBills();
  }
}
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { BillService } from '../../services/bill.service';
// import { SnackbarConfig, SnackbarService } from '../../services/snackbar.service';
// import { Bill } from '../../models/bill.model';
// import { ApiResponse } from '../../models/apiResponse.model';
// import { Table, TableModule } from 'primeng/table';
// import { CommonModule } from '@angular/common';
// import { ButtonModule } from 'primeng/button';
// import { Subscription } from 'rxjs';
// import { InputText } from 'primeng/inputtext';
// import { TagModule } from 'primeng/tag';
// import { BadgeModule } from 'primeng/badge';
// import { DialogModule } from 'primeng/dialog';
// import { IconFieldModule } from 'primeng/iconfield';
// import { InputIconModule } from 'primeng/inputicon';
// import { DatePickerModule } from 'primeng/datepicker';
// import { CalendarModule } from 'primeng/calendar';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// interface Column {
//   field: string;
//   header: string;
//   customExportHeader?: string;
// }

// interface ExportColumn {
//   title: string;
//   dataKey: string;
// }

// @Component({
//   selector: 'app-transaction',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ButtonModule,
//     TableModule,
//     InputText,
//     TagModule,
//     BadgeModule,
//     DialogModule,
//     IconFieldModule,
//     InputIconModule,
//     DatePickerModule,
//     CalendarModule,
//     FormsModule,
//     ReactiveFormsModule
//   ],
//   templateUrl: './transaction.component.html',
//   styleUrl: './transaction.component.css'
// })
// export class TransactionComponent implements OnInit, OnDestroy {
//   bills: Bill[] = [];
//   cols!: Column[];
//   selectedBills!: Bill[];
//   exportColumns!: ExportColumn[];
//   loading: boolean = true;
//   selectedBill: Bill | null = null;
//   viewDialogVisible: boolean = false;
//   snackbarVisible: boolean = false;
//   startDate: Date | null = null;
//   endDate: Date | null = null;
//   snackbarConfig: SnackbarConfig = {
//     type: 'success',
//     title: '',
//     message: '',
//     duration: 3000,
//   };

//   private snackbarSubscriptions: Subscription[] = [];

//   constructor(
//     private billService: BillService,
//     private snackbarService: SnackbarService
//   ) {}

//   ngOnInit(): void {
//     this.loadBills();
//     this.snackbarSubscriptions.push(
//       this.snackbarService.visible$.subscribe(
//         (visible) => (this.snackbarVisible = visible)
//       )
//     );

//     this.snackbarSubscriptions.push(
//       this.snackbarService.config$.subscribe(
//         (config) => (this.snackbarConfig = config)
//       )
//     );

//     this.cols = [
//       { field: 'billNumber', header: 'Bill Number' },
//       { field: 'cashierName', header: 'Cashier' },
//       { field: 'customerDetails.phone', header: 'Customer Phone' },
//       { field: 'totalAmount', header: 'Total Amount' },
//       { field: 'paymentDetails.method', header: 'Payment Method' },
//       { field: 'status', header: 'Status' },
//       { field: 'createdAt', header: 'Date' },
//     ];

//     this.exportColumns = this.cols.map((col) => ({
//       title: col.header,
//       dataKey: col.field,
//     }));
//   }

//   ngOnDestroy(): void {
//     this.snackbarSubscriptions.forEach((sub) => sub.unsubscribe());
//     this.snackbarService.hideSnackbar();
//   }

//   loadBills(): void {
//     this.loading = true;
//     const params: { startDate?: string; endDate?: string; status?: string } = {};
    
//     if (this.startDate) {
//       const start = new Date(this.startDate);
//       start.setHours(0, 0, 0, 0);
//       params.startDate = start.toISOString().split('T')[0];
//     }
//     if (this.endDate) {
//       const end = new Date(this.endDate);
//       end.setHours(23, 59, 59, 999);
//       params.endDate = end.toISOString().split('T')[0];
//     }

//     this.billService.getAllBill(params).subscribe({
//       next: (response: ApiResponse) => {
//         this.bills = response.data.reverse();
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Error loading bills:', error);
//         this.loading = false;
//         this.snackbarService.showError(
//           'Error',
//           'Failed to load transactions. Please try again!'
//         );
//       },
//     });
//   }

//   openViewDialog(bill: Bill): void {
//     this.selectedBill = { ...bill };
//     console.log(this.selectedBill);
//     this.viewDialogVisible = true;
//   }

//   getStatusSeverity(status: string): string {
//     switch (status) {
//       case 'COMPLETED':
//         return 'success';
//       case 'PENDING':
//         return 'warning';
//       case 'CANCELLED':
//         return 'danger';
//       case 'REFUNDED':
//         return 'info';
//       default:
//         return 'secondary';
//     }
//   }

//   formatDate(dateString: string): string {
//     return new Date(dateString).toLocaleDateString() + ' ' + 
//            new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   }

//   getItemCount(bill: Bill): number {
//     return bill.items ? bill.items.length : 0;
//   }

//   formatCurrency(amount: number): string {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'INR'
//     }).format(amount);
//   }

//   applyGlobalFilter(event: Event, dt: Table): void {
//     const filterValue = (event.target as HTMLInputElement).value
//       ?.trim()
//       .toLowerCase();

//     if (!dt) {
//       return;
//     }
//     dt.filters = {};
//     if ('visible'.startsWith(filterValue) && filterValue.length >= 1) {
//       dt.filter(true, 'isVisible', 'equals');
//     } else if ('hidden'.startsWith(filterValue) && filterValue.length >= 1) {
//       dt.filter(false, 'isVisible', 'equals');
//     } else {
//       dt.filterGlobal(filterValue, 'contains');
//     }
//   }

//   applyDateFilter(dt: Table): void {
//     this.loadBills();
//     dt.reset();
//   }

//   clearFilters(): void {
//     this.startDate = null;
//     this.endDate = null;
//     this.loadBills();
//   }
// }