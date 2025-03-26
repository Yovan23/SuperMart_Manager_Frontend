// import { Component,OnInit, OnDestroy } from '@angular/core';
// import { BillService } from '../../services/bill.service';
// import { SnackbarConfig, SnackbarService } from '../../services/snackbar.service';
// import { Bill } from '../../models/bill.model';
// import { ApiResponse } from '../../models/apiResponse.model';
// import { SnackbarComponent } from '../../layout/component/snackbar/snackbar.component';
// import { TableModule } from 'primeng/table';
// import { CommonModule } from '@angular/common';
// import { ButtonModule } from 'primeng/button';
// import { Subscription } from 'rxjs';
// import { InputText } from 'primeng/inputtext';
// @Component({
//   selector: 'app-transaction',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ButtonModule,
//     TableModule,
//     InputText,
//     SnackbarComponent,
//   ],
//   templateUrl: './transaction.component.html',
//   styleUrl: './transaction.component.css'
// })
// export class TransactionComponent implements OnInit, On{

// }
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { BillService } from '../../services/bill.service';
// import { SnackbarConfig, SnackbarService } from '../../services/snackbar.service';
// import { Bill } from '../../models/bill.model';
// import { ApiResponse } from '../../models/apiResponse.model';
// import { SnackbarComponent } from '../../layout/component/snackbar/snackbar.component';
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
// import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';


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
//     FormsModule,
//     ReactiveFormsModule
// ],
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
//     this.billService.getAllBill().subscribe({
//       next: (response: ApiResponse) => {
//         this.bills = response.data.reverse();
//         // console.log(response.data);
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
//            new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
//   }

//   getItemCount(bill: Bill): number {
//     return bill.items ? bill.items.length : 0;
//   }

//   // Method to format currency
//   formatCurrency(amount: number): string {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'INR'
//     }).format(amount);
//   }


//   applyGlobalFilter(event: Event, dt: Table): void {
//       const filterValue = (event.target as HTMLInputElement).value
//         ?.trim()
//         .toLowerCase();
  
//       if (!dt) {
//         return;
//       }
//       dt.filters = {};
//       if ('visible'.startsWith(filterValue) && filterValue.length >= 1) {
//         dt.filter(true, 'isVisible', 'equals');
//       } else if ('hidden'.startsWith(filterValue) && filterValue.length >= 1) {
//         dt.filter(false, 'isVisible', 'equals');
//       } else {
//         dt.filterGlobal(filterValue, 'contains');
//       }
  
//     }
// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { SnackbarConfig, SnackbarService } from '../../services/snackbar.service';
import { Bill } from '../../models/bill.model';
import { ApiResponse } from '../../models/apiResponse.model';
import { Table, TableModule } from 'primeng/table';
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
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    CalendarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit, OnDestroy {
  bills: Bill[] = [];
  cols!: Column[];
  selectedBills!: Bill[];
  exportColumns!: ExportColumn[];
  loading: boolean = true;
  selectedBill: Bill | null = null;
  viewDialogVisible: boolean = false;
  snackbarVisible: boolean = false;
  startDate: Date | null = null;
  endDate: Date | null = null;
  snackbarConfig: SnackbarConfig = {
    type: 'success',
    title: '',
    message: '',
    duration: 3000,
  };

  private snackbarSubscriptions: Subscription[] = [];

  constructor(
    private billService: BillService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadBills();
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
      { field: 'billNumber', header: 'Bill Number' },
      { field: 'cashierName', header: 'Cashier' },
      { field: 'customerDetails.phone', header: 'Customer Phone' },
      { field: 'totalAmount', header: 'Total Amount' },
      { field: 'paymentDetails.method', header: 'Payment Method' },
      { field: 'status', header: 'Status' },
      { field: 'createdAt', header: 'Date' },
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

  openViewDialog(bill: Bill): void {
    this.selectedBill = { ...bill };
    console.log(this.selectedBill);
    this.viewDialogVisible = true;
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'danger';
      case 'REFUNDED':
        return 'info';
      default:
        return 'secondary';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getItemCount(bill: Bill): number {
    return bill.items ? bill.items.length : 0;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  applyGlobalFilter(event: Event, dt: Table): void {
    const filterValue = (event.target as HTMLInputElement).value
      ?.trim()
      .toLowerCase();

    if (!dt) {
      return;
    }
    dt.filters = {};
    if ('visible'.startsWith(filterValue) && filterValue.length >= 1) {
      dt.filter(true, 'isVisible', 'equals');
    } else if ('hidden'.startsWith(filterValue) && filterValue.length >= 1) {
      dt.filter(false, 'isVisible', 'equals');
    } else {
      dt.filterGlobal(filterValue, 'contains');
    }
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