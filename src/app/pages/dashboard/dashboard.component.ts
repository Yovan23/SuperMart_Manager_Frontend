import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  stats = [
    {
      title: 'Orders',
      value: '152',
      icon: 'fa-shopping-cart',
      change: '24 new',
      changeText: 'since last visit',
      iconColor: '#3b82f6',
    },
    {
      title: 'Revenue',
      value: '$2,100',
      icon: 'fa-dollar-sign',
      change: '52%+',
      changeText: 'since last week',
      iconColor: '#f59e0b',
    },
    {
      title: 'Customers',
      value: '28,441',
      icon: 'fa-users',
      change: '520',
      changeText: 'newly registered',
      iconColor: '#06b6d4',
    },
    {
      title: 'Comments',
      value: '152 Unread',
      icon: 'fa-comments',
      change: '85',
      changeText: 'responded',
      iconColor: '#8b5cf6',
    },
  ];
}
