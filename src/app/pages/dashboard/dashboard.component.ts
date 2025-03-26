// import { isPlatformBrowser } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { DashboardService } from '../../services/dashboard.service';
// import { MessageService } from 'primeng/api';
// import { ApiResponse } from '../../models/apiResponse.model';
// import { ChangeDetectorRef, effect, inject, PLATFORM_ID } from '@angular/core';
// import { ChartModule } from 'primeng/chart';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, ChartModule],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css'],
// })
// export class DashboardComponent implements OnInit {
//   loading = false;
//   data: any = {};
//   startDate: any;
//   endDate: any;
//   data1: any = {};
//   constructor(
//     private dashboardService: DashboardService,
//     private messageService: MessageService,
//     private cd: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.loadData();
//     this.initChart();
//   }

//   loadData(): void {
//     this.loading = true;
//     const params: { startDate?: string; endDate?: string; status?: string } =
//       {};

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
//         this.updateStats();
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Error loading bills:', error);
//         this.loading = false;
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
//       changeText: 'iteams in stock',
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

//   options = {};

//   platformId = inject(PLATFORM_ID);

//   initChart() {
//     if (isPlatformBrowser(this.platformId)) {
//       const documentStyle = getComputedStyle(document.documentElement);
//       const textColor = documentStyle.getPropertyValue('--text-color');

//       this.data1 = {
//         labels: ['A', 'B', 'C', 'D'],
//         datasets: [
//           {
//             data: [540, 325, 702, 600],
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

//       this.options = {
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
// }


import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { MessageService } from 'primeng/api';
import { ApiResponse } from '../../models/apiResponse.model';
import { ChangeDetectorRef, effect, inject, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  loading = false;
  data: any = {};
  startDate: any;
  endDate: any;
  data1: any = {}; // For Sales Distribution (pie chart)
  data2: any = {}; // For Last 7 days Sale (half doughnut chart)
  options: any = {}; // Options for pie chart
  doughnutOptions: any = {}; // Options for half doughnut chart

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadSevenDaysSale(); // Load data for the doughnut chart
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
        this.updateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bills:', error);
        this.loading = false;
      },
    });
  }

  // New method to fetch 7-day sales data
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

      this.data1 = {
        labels: ['A', 'B', 'C', 'D'],
        datasets: [
          {
            data: [540, 325, 702, 600],
            backgroundColor: [
              documentStyle.getPropertyValue('--p-cyan-500'),
              documentStyle.getPropertyValue('--p-orange-500'),
              documentStyle.getPropertyValue('--p-gray-500'),
              documentStyle.getPropertyValue('--p-black-500'),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--p-cyan-400'),
              documentStyle.getPropertyValue('--p-orange-400'),
              documentStyle.getPropertyValue('--p-gray-400'),
              documentStyle.getPropertyValue('--p-black-400'),
            ],
          },
        ],
      };

      // Pie chart options
      this.options = {
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

      // Half doughnut chart options
      this.doughnutOptions = {
        rotation: -90, // Start from top
        circumference: 180, // Half circle
        cutout: '50%', // Thickness of the doughnut
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

  // Update doughnut chart with API data
  updateDoughnutChart(dailyData: any[]) {
    const documentStyle = getComputedStyle(document.documentElement);
    this.data2 = {
      labels: dailyData.map((item: any) => `${item.day}`),
      datasets: [
        {
          data: dailyData.map((item: any) => item.totalSales),
          backgroundColor: [
            documentStyle.getPropertyValue('--p-blue-500'),
            documentStyle.getPropertyValue('--p-green-500'),
            documentStyle.getPropertyValue('--p-yellow-500'),
            documentStyle.getPropertyValue('--p-red-500'),
            documentStyle.getPropertyValue('--p-purple-500'),
            documentStyle.getPropertyValue('--p-teal-500'),
            documentStyle.getPropertyValue('--p-pink-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--p-blue-400'),
            documentStyle.getPropertyValue('--p-green-400'),
            documentStyle.getPropertyValue('--p-yellow-400'),
            documentStyle.getPropertyValue('--p-red-400'),
            documentStyle.getPropertyValue('--p-purple-400'),
            documentStyle.getPropertyValue('--p-teal-400'),
            documentStyle.getPropertyValue('--p-pink-400'),
          ],
        },
      ],
    };
  }
}