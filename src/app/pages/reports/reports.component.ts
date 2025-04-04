// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { DatePicker } from 'primeng/datepicker';
// import { DialogModule } from 'primeng/dialog';
// import { TableModule } from 'primeng/table';
// import { ButtonModule } from 'primeng/button';
// import { DashboardService } from '../../services/dashboard.service';

// @Component({
//   selector: 'app-reports',
//   standalone: true,
//   imports: [CommonModule, FormsModule, DatePicker, DialogModule, TableModule, ButtonModule],
//   templateUrl: './reports.component.html',
//   styleUrl: './reports.component.css'
// })
// export class ReportsComponent {
//   dateRange: Date[] = [];
//   dialogVisible: boolean = false;
//   data: any[] = [];

//   constructor(private dashboardService: DashboardService) {
//     const today = new Date();
//     const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     this.dateRange = [firstDayOfMonth, today];
//   }


//   getProductSaleDatewise(): void {
//     if (this.dateRange && this.dateRange.length === 2) {
//       const fromDate = this.dateRange[0].toISOString().split('T')[0];
//       const toDate = this.dateRange[1].toISOString().split('T')[0];
      
//       this.dashboardService.getProductSaleDatewise(fromDate, toDate).subscribe(
//         (response) => {
//           this.data = response.data; 
//           this.dialogVisible = true; 
//         },
//         (error) => {
//           console.error('Error fetching product sale data:', error);
//         }
//       );
//     } else {
//       console.error('Invalid date range selected');
//     }
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DashboardService } from '../../services/dashboard.service';
import * as XLSX from 'xlsx';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePicker, DialogModule, TableModule, ButtonModule, CardModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  dateRange: Date[] = [];
  dialogVisible: boolean = false;
  data: any[] = [];

  constructor(private dashboardService: DashboardService) {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.dateRange = [firstDayOfMonth, today];
  }

  getProductSaleDatewise(): void {
    if (this.dateRange && this.dateRange.length === 2) {
      const fromDate = this.dateRange[0].toISOString().split('T')[0];
      const toDate = this.dateRange[1].toISOString().split('T')[0];
      
      this.dashboardService.getProductSaleDatewise(fromDate, toDate).subscribe(
        (response) => {
          this.data = response.data; 
          this.dialogVisible = true; 
        },
        (error) => {
          console.error('Error fetching product sale data:', error);
        }
      );
    } else {
      console.error('Invalid date range selected');
    }
  }

  exportToExcel(): void {
    if (!this.data || this.data.length === 0) {
      console.error('No data available for export');
      return;
    }
  
    // Exclude unwanted fields (_id, categoryId, productId)
    const exportedData = this.data.map(({ _id, categoryId, productId, ...rest }) => ({
      Barcode: rest.barcode, 
      "Product Name": rest.productName, 
      "Total Sale": rest.totalAmount + rest.totalTax, 
      "Total Quantity": rest.totalQuantity
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(exportedData);
    
    // Auto-adjust column width
    const wscols = [
      { wch: 15 }, // Barcode
      { wch: 25 }, // Product Name
      { wch: 15 }, // Total Sale
      { wch: 15 }, // Total Quantity
    ];
    worksheet['!cols'] = wscols;
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Sales');
  
    XLSX.writeFile(workbook, 'Product_Sales_Report.xlsx');
  }
  
}
