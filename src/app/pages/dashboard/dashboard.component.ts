// import { isPlatformBrowser } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { DashboardService } from '../../services/dashboard.service';
// import { MessageService } from 'primeng/api';
// import { ApiResponse } from '../../models/apiResponse.model';
// import { ChangeDetectorRef, inject, PLATFORM_ID } from '@angular/core';
// import { ChartModule } from 'primeng/chart';
// import { TableModule } from 'primeng/table';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, ChartModule, TableModule],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css'],
// })
// export class DashboardComponent implements OnInit {
//   loading = false;
//   data: any = {};
//   startDate: any;
//   endDate: any;
//   data1: any = {};
//   data2: any = {};
//   options: any = {};
//   doughnutOptions: any = {};
//   recentTransaction: any = [];

//   constructor(
//     private dashboardService: DashboardService,
//     private messageService: MessageService,
//     private cd: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.loadData();
//     this.loadSevenDaysSale();
//     this.loadFlexibleDataOfSale(); // Load bar chart data
//     this.initCharts();
//   }

//   loadData(): void {
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

//     this.dashboardService.summaryForAdmin(params).subscribe({
//       next: (response: ApiResponse) => {
//         this.data = response.data;
//         if (response.data && 'recentTransactions' in response.data) {
//           this.recentTransaction = response.data.recentTransactions;
//         } else {
//           console.error('Invalid response data format:', response.data);
//           this.recentTransaction = [];
//         }
//         this.updateStats();
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Error loading bills:', error);
//         this.loading = false;
//       },
//     });
//   }

//   // Fetch flexible sales data for bar chart
//   loadFlexibleDataOfSale(): void {
//     const params: { period?: string } = {}; // You can add period filtering logic here if needed

//     this.dashboardService.getFelxibleDataOfSale(params).subscribe({
//       next: (response: ApiResponse) => {
//         if (response.success) {
//           // Assuming response.data is an array of { day: string, totalSales: number }
//           this.updateBarChart(response.data);
//         }
//       },
//       error: (error) => {
//         console.error('Error loading flexible sales data:', error);
//       },
//     });
//   }

//   // Fetch 7-day sales data for doughnut chart
//   loadSevenDaysSale(): void {
//     this.dashboardService.sevendaysTotalSale().subscribe({
//       next: (response: any) => {
//         if (response.success) {
//           this.updateDoughnutChart(response.data.dailyData);
//         }
//       },
//       error: (error) => {
//         console.error('Error loading 7-day sales:', error);
//       },
//     });
//   }

//   updateStats(): void {
//     this.stats[0].value = this.data.sales?.netSales || 0;
//     this.stats[0].change = this.data.sales?.completedOrders || 0;
//     this.stats[2].value = this.data.cost?.grossProfit || 0;
//     this.stats[2].change = this.data.cost?.profitMargin || 0;
//     this.stats[1].value = this.data.inventory?.totalInventoryValue || 0;
//     this.stats[1].change = this.data.inventory?.totalItemsInStock || 0;
//     this.stats[3].value = this.data.totalEmployees || 0;
//     this.stats[3].change = this.data.activeEmployees || 0;
//   }

//   stats = [
//     {
//       title: 'Total Sales',
//       value: 0,
//       icon: 'pi-indian-rupee',
//       change: 0,
//       changeText: 'completed orders',
//       iconColor: '#3b82f6',
//     },
//     {
//       title: 'Inventory Value',
//       value: 0,
//       icon: 'pi-box',
//       change: 0,
//       changeText: 'items in stock',
//       iconColor: '#06b6d4',
//     },
//     {
//       title: 'Gross Profit',
//       value: 0,
//       icon: 'pi-chart-line',
//       change: 0,
//       changeText: '% Profit Margin',
//       iconColor: '#f59e0b',
//     },
//     {
//       title: 'Total Employee',
//       value: 0,
//       icon: 'pi-users',
//       change: 0,
//       changeText: 'Active Employees',
//       iconColor: '#8b5cf6',
//     },
//   ];

//   platformId = inject(PLATFORM_ID);

//   initCharts() {
//     if (isPlatformBrowser(this.platformId)) {
//       const documentStyle = getComputedStyle(document.documentElement);
//       const textColor = documentStyle.getPropertyValue('--text-color');

//       // Initial placeholder data for bar chart
//       this.data1 = {
//         labels: ['A', 'B', 'C', 'D'],
//         datasets: [
//           {
//             label: 'Sales',
//             data: [540, 325, 702, 1000],
//             backgroundColor: [
//               documentStyle.getPropertyValue('--p-cyan-500'),
//               documentStyle.getPropertyValue('--p-orange-500'),
//               documentStyle.getPropertyValue('--p-gray-500'),
//               documentStyle.getPropertyValue('--p-black-500'),
//             ],
//             hoverBackgroundColor: [
//               documentStyle.getPropertyValue('--p-cyan-400'),
//               documentStyle.getPropertyValue('--p-orange-400'),
//               documentStyle.getPropertyValue('--p-gray-400'),
//               documentStyle.getPropertyValue('--p-black-400'),
//             ],
//           },
//         ],
//       };

//       // Bar chart options
//       this.options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             position: 'top',
//             labels: {
//               color: textColor,
//             },
//           },
//         },
//         scales: {
//           x: {
//             ticks: {
//               color: textColor,
//             },
//             grid: {
//               color: 'rgba(0,0,0,0.1)',
//             },
//           },
//           y: {
//             ticks: {
//               color: textColor,
//             },
//             grid: {
//               color: 'rgba(0,0,0,0.1)',
//             },
//           },
//         },
//       };

//       // Half doughnut chart options
//       this.doughnutOptions = {
//         rotation: -90,
//         circumference: 180,
//         cutout: '50%',
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             position: 'right',
//             labels: {
//               usePointStyle: true,
//               color: textColor,
//               boxWidth: 12,
//               padding: 20,
//             },
//           },
//         },
//       };

//       this.cd.markForCheck();
//     }
//   }

//   // Update bar chart with API data
//   updateBarChart(salesData: any[]) {
//     const documentStyle = getComputedStyle(document.documentElement);
//     this.data1 = {
//       labels: salesData.map((item: any) => item.period || item.label), // Adjust based on your API response structure
//       datasets: [
//         {
//           label: 'Sales',
//           data: salesData.map((item: any) => item.totalSales || item.value), // Adjust based on your API response structure
//           backgroundColor: [
//             documentStyle.getPropertyValue('--p-cyan-500'),
//             documentStyle.getPropertyValue('--p-orange-500'),
//             documentStyle.getPropertyValue('--p-gray-500'),
//             documentStyle.getPropertyValue('--p-black-500'),
//           ].slice(0, salesData.length), // Limit colors to data length
//           hoverBackgroundColor: [
//             documentStyle.getPropertyValue('--p-cyan-400'),
//             documentStyle.getPropertyValue('--p-orange-400'),
//             documentStyle.getPropertyValue('--p-gray-400'),
//             documentStyle.getPropertyValue('--p-black-400'),
//           ].slice(0, salesData.length), // Limit colors to data length
//         },
//       ],
//     };
//     this.cd.markForCheck(); // Ensure UI updates
//   }

//   // Update doughnut chart with API data
//   updateDoughnutChart(dailyData: any[]) {
//     const documentStyle = getComputedStyle(document.documentElement);
//     this.data2 = {
//       labels: dailyData.map((item: any) => `${item.day}`),
//       datasets: [
//         {
//           data: dailyData.map((item: any) => item.totalSales),
//           backgroundColor: [
//             '#1E3A8A',
//             '#1E40AF',
//             '#3B82F6',
//             '#60A5FA',
//             '#93C5FD',
//             '#BFDBFE',
//             '#DBEAFE',
//           ],
//           hoverBackgroundColor: [
//             '#2B4BA1',
//             '#2B54C6',
//             '#4D8EFA',
//             '#7BB5FC',
//             '#A3D1FE',
//             '#CCE4FE',
//             '#E6F0FE',
//           ],
//         },
//       ],
//     };
//     this.cd.markForCheck(); // Ensure UI updates
//   }
// }

import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { MessageService } from 'primeng/api';
import { ApiResponse } from '../../models/apiResponse.model';
import { ChangeDetectorRef, inject, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, TableModule, ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  loading = false;
  data: any = {};
  startDate: any;
  endDate: any;
  data1: any = {}; // Initially empty, will be populated by API
  data2: any = {};
  options: any = {};
  doughnutOptions: any = {};
  recentTransaction: any = [];
  selectedPeriod: string = 'month';

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadSevenDaysSale();
    this.loadFlexibleDataOfSale(); // Load bar chart data
    this.initCharts();
  }

  loadData(): void {
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

    this.dashboardService.summaryForAdmin(params).subscribe({
      next: (response: ApiResponse) => {
        this.data = response.data;
        if (response.data && 'recentTransactions' in response.data) {
          this.recentTransaction = response.data.recentTransactions;
        } else {
          console.error('Invalid response data format:', response.data);
          this.recentTransaction = [];
        }
        this.updateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bills:', error);
        this.loading = false;
      },
    });
  }

  // Fetch flexible sales data for bar chart
  loadFlexibleDataOfSale(): void {
    const params: { period?: string } = { period: this.selectedPeriod };

    this.dashboardService.getFelxibleDataOfSale(params).subscribe({
      next: (response: ApiResponse) => {
        if (response.success) {
          this.updateBarChart(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading flexible sales data:', error);
      },
    });
  }

  // Fetch 7-day sales data for doughnut chart
  loadSevenDaysSale(): void {
    this.dashboardService.sevendaysTotalSale().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.updateDoughnutChart(response.data.dailyData);
        }
      },
      error: (error) => {
        console.error('Error loading 7-day sales:', error);
      },
    });
  }

  changePeriod(period: string): void {
    this.selectedPeriod = period;
    this.loadFlexibleDataOfSale(); // Reload data with new period
  }

  updateStats(): void {
    this.stats[0].value = this.data.sales?.netSales || 0;
    this.stats[0].change = this.data.sales?.completedOrders || 0;
    this.stats[2].value = this.data.cost?.grossProfit || 0;
    this.stats[2].change = this.data.cost?.profitMargin || 0;
    this.stats[1].value = this.data.inventory?.totalInventoryValue || 0;
    this.stats[1].change = this.data.inventory?.totalItemsInStock || 0;
    this.stats[3].value = this.data.totalEmployees || 0;
    this.stats[3].change = this.data.activeEmployees || 0;
  }

  stats = [
    {
      title: 'Total Sales',
      value: 0,
      icon: 'pi-indian-rupee',
      change: 0,
      changeText: 'completed orders',
      iconColor: '#3b82f6',
    },
    {
      title: 'Inventory Value',
      value: 0,
      icon: 'pi-box',
      change: 0,
      changeText: 'items in stock',
      iconColor: '#06b6d4',
    },
    {
      title: 'Gross Profit',
      value: 0,
      icon: 'pi-chart-line',
      change: 0,
      changeText: '% Profit Margin',
      iconColor: '#f59e0b',
    },
    {
      title: 'Total Employee',
      value: 0,
      icon: 'pi-users',
      change: 0,
      changeText: 'Active Employees',
      iconColor: '#8b5cf6',
    },
  ];

  platformId = inject(PLATFORM_ID);

  initCharts() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      // Bar chart options (no initial data1 here)
      this.options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColor,
            },
            grid: {
              color: 'rgba(0,0,0,0.1)',
            },
          },
          y: {
            ticks: {
              color: textColor,
            },
            grid: {
              color: 'rgba(0,0,0,0.1)',
            },
          },
        },
      };

      // Half doughnut chart options
      this.doughnutOptions = {
        rotation: -90,
        circumference: 180,
        cutout: '50%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              color: textColor,
              boxWidth: 12,
              padding: 20,
            },
          },
        },
      };

      this.cd.markForCheck();
    }
  }

  // Update bar chart with API data
  updateBarChart(salesData: any[]) {
    const documentStyle = getComputedStyle(document.documentElement);
    this.data1 = {
      labels: salesData.map((item: any) => item.period || item.label), // Adjust based on API response
      datasets: [
        {
          label: 'Sales',
          data: salesData.map((item: any) => item.totalSales || item.value), // Adjust based on API response
          backgroundColor: [
            documentStyle.getPropertyValue('--p-cyan-500'),
            // documentStyle.getPropertyValue('--p-orange-500'),
            // documentStyle.getPropertyValue('--p-gray-500'),
            // documentStyle.getPropertyValue('--p-black-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--p-cyan-400'),
            // documentStyle.getPropertyValue('--p-orange-400'),
            // documentStyle.getPropertyValue('--p-gray-400'),
            // documentStyle.getPropertyValue('--p-black-400'),
          ].slice(0, salesData.length),
        },
      ],
    };
    this.cd.markForCheck(); // Ensure UI updates
  }

  // Update doughnut chart with API data
  updateDoughnutChart(dailyData: any[]) {
    const documentStyle = getComputedStyle(document.documentElement);
    this.data2 = {
      labels: dailyData.map((item: any) => `${item.day}`),
      datasets: [
        {
          data: dailyData.map((item: any) => item.totalSales),
          backgroundColor: [
            '#1E3A8A',
            '#1E40AF',
            '#3B82F6',
            '#60A5FA',
            '#93C5FD',
            '#BFDBFE',
            '#DBEAFE',
          ],
          hoverBackgroundColor: [
            '#2B4BA1',
            '#2B54C6',
            '#4D8EFA',
            '#7BB5FC',
            '#A3D1FE',
            '#CCE4FE',
            '#E6F0FE',
          ],
        },
      ],
    };
    this.cd.markForCheck(); // Ensure UI updates
  }
}