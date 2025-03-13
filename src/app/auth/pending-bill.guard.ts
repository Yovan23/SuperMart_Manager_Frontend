// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { BillService } from '../services/bill.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class PendingBillGuard implements CanActivate {
//   constructor(private billService: BillService, private router: Router) {}

//   canActivate(): boolean {
//     const currentBill = this.billService.(); // Ensure you have this method in BillService

//     if (currentBill && currentBill.status === 'PENDING') {
//       alert('Complete or cancel the current bill before navigating away.');
//       return false;
//     }
//     return true;
//   }
// }
