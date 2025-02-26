import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../services/login.service';
import { environment } from '../../../environments/environment';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    RippleModule
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  isHandset$: Observable<boolean>;
  userData: any = null;
  sidebarVisible: boolean = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );

    this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        this.sidebarVisible = false;
      }
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.validateToken().subscribe({
      next: (response) => {
        this.userData = response.data;
        this.userData.profilePicture = `${environment.imageUrl}${this.userData.profilePicture}`;
      },
      error: () => {
        this.logout();
      }
    });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  
  openUserProfile() {
    this.router.navigate(['/dashboard/userProfile']);
  }
  
  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}