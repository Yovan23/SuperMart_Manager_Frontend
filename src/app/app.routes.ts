import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { authGuard } from './auth/auth.guard';
import { CategoryComponent } from './pages/category/category.component';
import { ProductComponent } from './pages/product/product.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { LogComponent } from './pages/log/log.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { StockComponent } from './pages/stock/stock.component';
import { BillComponent } from './pages/bill/bill.component';
import { TransactionComponent } from './pages/transaction/transaction.component';
import { AuthGuardService } from './auth/auth-guard';
import { ReportsComponent } from './pages/reports/reports.component';
import { NotFoundComponent } from './pages/not-found/not-found.component'; 
import { DashboardCashierComponent } from './pages/dashboard-cashier/dashboard-cashier.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
  {
    path: 'dashboard',
    component: NavigationComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardComponent, title: 'Dashboard-SMM' },
      { path: 'cashier', component: DashboardCashierComponent, title: 'Dashboard-Cashier-SMM' },
      { path: 'users', component: UsersComponent, title: 'User-SMM' },
      { path: 'category', component: CategoryComponent, title: 'Category-SMM' },
      { path: 'product', component: ProductComponent, title: 'Product-SMM' },
      { path: 'supplier', component: SupplierComponent, title: 'Supplier-SMM' },
      { path: 'log', component: LogComponent, title: 'Log-SMM' },
      { path: 'userProfile', component: UserProfileComponent, title: 'UserProfile-SMM' },
      { path: 'stock', component: StockComponent, title: 'Stock-SMM' },
      { path: 'bill', component: BillComponent, title: 'Bill-SMM' },
      { path: 'transaction', component: TransactionComponent, title: 'Transaction-SMM' },
      { path: 'reports', component: ReportsComponent, title: 'Reports-SMM' },
    ],
  },
  { path: '**', component: NotFoundComponent }, 
];
