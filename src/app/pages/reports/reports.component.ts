import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DatePicker } from 'primeng/datepicker';
import { DashboardService } from '../../services/dashboard.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DialogModule,
    TableModule,
    CalendarModule,
    DatePicker,
    ToastModule
  ],
  providers: [DatePipe, MessageService],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  salesDateRange: Date[] = [];
  salesDialogVisible: boolean = false;
  salesData: any[] = [];
  salesHasSearched: boolean = false;
  salesLoading: boolean = false;

  // Cashier Report Variables
  cashierDateRange: Date[] = [];
  cashierDialogVisible: boolean = false;
  cashierData: any[] = [];
  cashierHasSearched: boolean = false;
  cashierLoading: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Initialize Sales Report
    this.salesDateRange = [firstDayOfMonth, today];
    this.getProductSaleDatewise();
    
    // Initialize Cashier Report
    this.cashierDateRange = [firstDayOfMonth, today];
    this.getCashierSummaryDatewise();
  }

  // Sales Report Methods
  showSalesDataDialog(): void {
    if (this.salesData && this.salesData.length > 0) {
      this.salesDialogVisible = true;
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'No Data',
        detail: 'No sales data available to display'
      });
    }
  }

  onSalesDateSelect(): void {
    if (this.salesDateRange && this.salesDateRange.length === 2 && this.salesDateRange[0] && this.salesDateRange[1]) {
      this.getProductSaleDatewise();
    }
  }

  getProductSaleDatewise(): void {
    if (this.salesDateRange && this.salesDateRange.length === 2) {
      this.salesLoading = true;
      this.salesHasSearched = true;
      
      const fromDate = this.salesDateRange[0].toISOString().split('T')[0];
      const toDate = this.salesDateRange[1].toISOString().split('T')[0];
      
      this.dashboardService.getProductSaleDatewise(fromDate, toDate).subscribe(
        (response) => {
          this.salesData = response.data;
          this.salesLoading = false;
          
          if (this.salesData.length === 0) {
            this.messageService.add({
              severity: 'info',
              summary: 'No Data',
              detail: 'No sales data found for the selected date range.'
            });
          }
        },
        (error) => {
          this.salesLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch sales data. Please try again.'
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Selection',
        detail: 'Please select a valid date range'
      });
    }
  }

  exportSalesToExcel(): void {
    if (!this.salesData || this.salesData.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Export Failed',
        detail: 'No sales data available for export'
      });
      return;
    }

    const fromDate = this.datePipe.transform(this.salesDateRange[0], 'yyyyMMdd');
    const toDate = this.datePipe.transform(this.salesDateRange[1], 'yyyyMMdd');
    
    const exportedData = this.salesData.map(({ _id, categoryId, productId, ...rest }) => ({
      'Barcode': rest.barcode,
      'Product Name': rest.productName,
      'Total Sale': rest.totalAmount + rest.totalTax,
      'Total Quantity': rest.totalQuantity
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportedData);
    const wscols = [
      { wch: 15 }, // Barcode
      { wch: 30 }, // Product Name
      { wch: 15 }, // Total Sale
      { wch: 15 }  // Total Quantity
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Sales');

    const filename = `Sales_Report_${fromDate}_to_${toDate}.xlsx`;
    XLSX.writeFile(workbook, filename);

    this.messageService.add({
      severity: 'success',
      summary: 'Export Complete',
      detail: `Sales report exported as ${filename}`
    });
  }

  // Cashier Report Methods
  showCashierDataDialog(): void {
    if (this.cashierData && this.cashierData.length > 0) {
      this.cashierDialogVisible = true;
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'No Data',
        detail: 'No cashier data available to display'
      });
    }
  }

  onCashierDateSelect(): void {
    if (this.cashierDateRange && this.cashierDateRange.length === 2 && this.cashierDateRange[0] && this.cashierDateRange[1]) {
      this.getCashierSummaryDatewise();
    }
  }

  getCashierSummaryDatewise(): void {
    if (this.cashierDateRange && this.cashierDateRange.length === 2) {
      this.cashierLoading = true;
      this.cashierHasSearched = true;
      
      const fromDate = this.cashierDateRange[0].toISOString().split('T')[0];
      const toDate = this.cashierDateRange[1].toISOString().split('T')[0];
      
      this.dashboardService.cashierSummary({fromDate, toDate}).subscribe(
        (response) => {
          this.cashierData = (response.data as any).summary || [];
          this.cashierLoading = false;
          
          if (this.cashierData.length === 0) {
            this.messageService.add({
              severity: 'info',
              summary: 'No Data',
              detail: 'No cashier data found for the selected date range.'
            });
          }
        },
        (error) => {
          this.cashierLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch cashier data. Please try again.'
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Selection',
        detail: 'Please select a valid date range'
      });
    }
  }

  exportCashierToExcel(): void {
    if (!this.cashierData || this.cashierData.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Export Failed',
        detail: 'No cashier data available for export'
      });
      return;
    }

    const fromDate = this.datePipe.transform(this.cashierDateRange[0], 'yyyyMMdd');
    const toDate = this.datePipe.transform(this.cashierDateRange[1], 'yyyyMMdd');
    
    const exportedData = this.cashierData.map((item) => ({
      'Employee Code': item.employeeCode,
      'Cashier Name': item.cashierName,
      'Total Sale': (item.totalSales || 0) + (item.totalDiscount || 0),
      'Total Discount': item.totalDiscount,
      'Total Transactions': item.totalBills,
      'UPI Payment': item.paymentMethodDistribution?.UPI || 0,
      'Cash Payment': item.paymentMethodDistribution?.CASH || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportedData);
    const wscols = [
      { wch: 15 }, // Cashier ID
      { wch: 25 }, // Cashier Name
      { wch: 15 }, // Total Sale
      { wch: 15 }, 
      { wch: 20 }, // Cashier Name
      { wch: 20 }, // Total Sale
      { wch: 20 }, // Total Transactions
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cashier Summary');

    const filename = `Cashier_Report_${fromDate}_to_${toDate}.xlsx`;
    XLSX.writeFile(workbook, filename);

    this.messageService.add({
      severity: 'success',
      summary: 'Export Complete',
      detail: `Cashier report exported as ${filename}`
    });
  }
}