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
  imports: [CommonModule, RouterModule, ButtonModule, RippleModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  isHandset$: Observable<boolean>;
  isTablet$: Observable<boolean>;
  userData: any = null;
  sidebarVisible: boolean = true;
  isMobile: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {
    // Observe for Handset (mobile devices, typically <600px)
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay()
    );

    // Observe for Tablet (up to 768px)
    this.isTablet$ = this.breakpointObserver
      .observe([Breakpoints.TabletPortrait, Breakpoints.TabletLandscape])
      .pipe(
        map((result) => result.matches),
        shareReplay()
      );

    // Combine observations to determine if we're on a mobile device
    this.isHandset$.subscribe((isHandset) => {
      if (isHandset) {
        this.isMobile = true;
        // Only set sidebarVisible to false on initial load if not already set
        if (this.sidebarVisible === true && !localStorage.getItem('sidebarVisible')) {
          this.sidebarVisible = false;
        }
      }
    });

    this.isTablet$.subscribe((isTablet) => {
      if (isTablet && !this.isMobile) {
        this.isMobile = true;
        // Only set sidebarVisible to false on initial load if not already set
        if (this.sidebarVisible === true && !localStorage.getItem('sidebarVisible')) {
          this.sidebarVisible = false;
        }
      } else if (!isTablet && !this.isMobile) {
        this.isMobile = false;
        this.sidebarVisible = true;
      }
    });
  }

  ngOnInit() {
    this.loadUserData();
    // Restore sidebar state if previously set (optional persistence)
    const savedSidebarState = localStorage.getItem('sidebarVisible');
    if (savedSidebarState) {
      this.sidebarVisible = savedSidebarState === 'true';
    }
  }

  loadUserData() {
    this.authService.validateToken().subscribe({
      next: (response) => {
        this.userData = response.data;
        this.userData.profilePicture = `${environment.imageUrl}${this.userData.profilePicture}`;
      },
      error: () => {
        this.logout();
      },
    });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    // Save the sidebar state (optional persistence)
    localStorage.setItem('sidebarVisible', this.sidebarVisible.toString());
  }

  closeSidebar() {
    if (this.isMobile) {
      this.sidebarVisible = false;
      // Save the sidebar state (optional persistence)
      localStorage.setItem('sidebarVisible', this.sidebarVisible.toString());
    }
  }

  openUserProfile() {
    // No automatic closing here; sidebar stays open unless explicitly closed
    this.router.navigate(['/dashboard/userProfile']);
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}