import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { MessageService } from 'primeng/api';
import { ApiResponse } from '../../models/apiResponse.model';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {
  trigger,
  transition,
  style,
  animate,
  stagger,
  query,
} from '@angular/animations';

@Component({
  selector: 'app-dashboard-cashier',
  standalone: true,
  imports: [CommonModule, ChartModule, TableModule, ButtonModule],
  templateUrl: './dashboard-cashier.component.html',
  styleUrls: ['./dashboard-cashier.component.css'],
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger('100ms', [
              animate(
                '300ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class DashboardCashierComponent implements OnInit {
  loading = false;
  data: any = {};
  data1: any = {};
  options: any = {};
  data2: any = {};
  doughnutOptions: any = {};
  recentTransactions: any[] = [];
  selectedPeriod: string = 'week';
  selectedPeriodOfCategory: string = 'week';
  showAll: boolean = false;
  displayedCategories: any[] = [];
  salesByCategory: any[] = [];

  stats = [
    {
      title: 'Today Sales',
      value: 0,
      icon: 'pi-indian-rupee',
      change: 0,
      changeText: 'transactions',
      iconColor: '#3b82f6',
    },
    {
      title: 'Payment via Cash',
      value: 0,
      icon: 'pi-wallet',
      change: 0,
      changeText: 'transactions',
      iconColor: '#06b6d4',
    },
    {
      title: 'Payment via UPI',
      value: 0,
      icon: 'pi-ticket',
      change: 0,
      changeText: 'transactions',
      iconColor: '#f59e0b',
    },
  ];

  platformId = inject(PLATFORM_ID);

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadFlexibleDataOfSale();
    this.loadSalesByCategory();
    this.initCharts();
    this.loadSevenDaysSale();
  }

  loadData(): void {
    this.loading = true;
    const params: { fromDate?: string; toDate?: string } = {};

    this.dashboardService.cashierSummaryDetail().subscribe({
      next: (response: ApiResponse) => {
        this.data = response.data;
        if (response.data && 'recentTransactions' in response.data) {
          this.recentTransactions = response.data.recentTransactions as any[];
        } else {
          this.recentTransactions = [];
        }
        this.updateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cashier summary:', error);
        this.loading = false;
      },
    });
  }

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

  loadSalesByCategory(): void {
    const params: { periodOfCategory?: string } = {
      periodOfCategory: this.selectedPeriodOfCategory,
    };

    this.dashboardService.getSalesByCategory(params).subscribe({
      next: (response: ApiResponse) => {
        if (response.success) {
          this.updateSalesByCategory(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading sales by category:', error);
      },
    });
  }

  changePeriod(period: string): void {
    this.selectedPeriod = period;
    this.loadFlexibleDataOfSale();
  }

  changePeriodOfCategory(periodOfCategory: string): void {
    this.selectedPeriodOfCategory = periodOfCategory;
    this.loadSalesByCategory();
  }

  updateStats(): void {
    this.stats[0].value = this.data.todaysSalesAmount || 0;
    this.stats[0].change = this.data.numberOfBillsCreated || 0;
    this.stats[1].value = this.data.paymentViaCash.amount || 0;
    this.stats[1].change = this.data.paymentViaCash.count || 0;
    this.stats[2].value = this.data.paymentViaUPI.amount || 0;
    this.stats[2].change = this.data.paymentViaUPI.count || 0;

    setTimeout(() => {
      this.stats.forEach((stat, index) => {
        const element = document.querySelectorAll('.animated-value')[
          index
        ] as HTMLElement;
        if (element) {
          this.animateValue(element, 0, stat.value, 1000);
        }
      });
    });
  }

  animateValue(obj: HTMLElement, start: number, end: number, duration: number) {
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      obj.textContent = value.toString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  initCharts() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const backgroundColor =
        documentStyle.getPropertyValue('--background-color');
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
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              color: textColor,
            },
            grid: {
              color: 'rgba(0,0,0,0.1)',
            },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            ticks: {
              color: textColor,
            },
            grid: {
              drawOnChartArea: false, // Prevents overlapping grid lines
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

  updateBarChart(salesData: any[]) {
    const documentStyle = getComputedStyle(document.documentElement);
    this.data1 = {
      labels: salesData.map((item: any) => item.period || item.label), // Extracting period/label for X-axis
      datasets: [
        {
          label: 'Sales (Rs.)',
          data: salesData.map((item: any) => item.totalSales || item.value), // Extract Sales data
          backgroundColor: documentStyle.getPropertyValue('--p-blue-400'),
          hoverBackgroundColor: documentStyle.getPropertyValue('--p-blue-400'),
          yAxisID: 'y', // Assigning to left Y-axis
        },
        {
          label: 'Number of Orders',
          data: salesData.map((item: any) => item.orderCount || item.value),
          backgroundColor: documentStyle.getPropertyValue('--p-orange-600'),
          hoverBackgroundColor:
            documentStyle.getPropertyValue('--p-orange-400'),
          yAxisID: 'y1',
        },
      ],
    };

    this.cd.markForCheck(); // Ensure UI update
  }
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
    this.cd.markForCheck();
  }
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


  updateSalesByCategory(data: any): void {
    if (data && Array.isArray(data.categories)) {
      this.salesByCategory = data.categories.map(
        (item: { name: any; totalSales: any; percentage: any }) => ({
          category: item.name,
          sales: item.totalSales,
          percentage: item.percentage,
          color: this.getRandomColor(),
        })
      );
      this.updateDisplayedCategories();
      this.cd.markForCheck();
    } else {
      console.error('Invalid category data structure:', data);
      this.salesByCategory = [];
    }
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  updateDisplayedCategories(): void {
    this.displayedCategories = this.showAll
      ? this.salesByCategory
      : this.salesByCategory.slice(0, 2);
  }

  showAllCategories(): void {
    this.showAll = !this.showAll;
    this.updateDisplayedCategories();
  }
}