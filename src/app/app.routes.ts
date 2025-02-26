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

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', 
        component: NavigationComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: DashboardComponent },
            { path: 'users', component: UsersComponent },
            { path: 'category', component: CategoryComponent },
            { path: 'product', component: ProductComponent} ,
            { path: 'supplier', component: SupplierComponent },
            { path: 'log', component: LogComponent},
            { path: 'userProfile', component: UserProfileComponent},
            { path: 'stock', component: StockComponent},
        ]
    },
    { path: '**', redirectTo: 'login' }
];



// import { Routes } from '@angular/router';
// import { LoginComponent } from './login/login.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { NavigationComponent } from './navigation/navigation.component';
// import { authGuard } from './Service/auth.guard';

// export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   {
//     path: 'dashboard',
//     component: NavigationComponent,
//     canActivate: [authGuard],
//     children: [
//       { path: '', redirectTo: 'main', pathMatch: 'full' },
//       { path: 'main', component: DashboardComponent },
//     ],
//   },
//   { path: '**', redirectTo: 'login' }
// ];