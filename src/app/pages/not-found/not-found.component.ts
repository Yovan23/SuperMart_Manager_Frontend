import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/login.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'] 
})
export class NotFoundComponent {
  constructor(private authService: AuthService, private router: Router) {}

  goToHome() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['dashboard/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
