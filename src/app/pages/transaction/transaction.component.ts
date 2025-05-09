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
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
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
  currentYear: number = new Date().getFullYear();

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
    const field = event.field as string; 
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
    } else if (field === 'cashierName') {
      return data.cashierId?.name || null;
    }
    return data[field];
  }

prepareDataForExport(): any[] {
  return this.bills.map(bill => {
    const exportBill: any = {};
    
    this.visibleCols.forEach(col => {
      const field = col.field;
      
      if (field === 'cashierName') {
        exportBill[field] = bill.cashierId?.name || 'N/A';
      } 
      else if (field === 'customerDetails.phone') {
        exportBill[field] = bill.customerDetails?.phone || 'Walk-in customer';
      }
      else if (field === 'totalAmount') {
        exportBill[field] = this.formatCurrency(bill.totalAmount).replace('₹', '').trim();
      }
      else if (field === 'createdAt') {
        exportBill[field] = this.formatDate(bill.createdAt);
      }
      else {
        exportBill[field] = bill[field as keyof Bill];
      }
    });
    
    return exportBill;
  });
}

exportCSV(): void {
  const preparedData = this.prepareDataForExport();
  import('xlsx').then(xlsx => {
    const worksheet = xlsx.utils.json_to_sheet(preparedData);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'transactions');
  });
}

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  openViewDialog(bill: Bill): void {
    this.selectedBill = { ...bill };
    this.viewDialogVisible = true;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
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