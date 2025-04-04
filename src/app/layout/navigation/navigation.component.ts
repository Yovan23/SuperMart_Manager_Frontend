// import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule, Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { map, shareReplay } from 'rxjs/operators';
// import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
// import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';
// import { AuthService } from '../../services/login.service';
// import { environment } from '../../../environments/environment';
// import { ConfirmDialog } from 'primeng/confirmdialog';
// import { ToastModule } from 'primeng/toast';
// import { ButtonModule } from 'primeng/button';
// import { RippleModule } from 'primeng/ripple';
// import { TooltipModule } from 'primeng/tooltip';
// import { ConfirmationService, MessageService } from 'primeng/api';
// import { NotificationService } from '../../services/notification.service';
// import { Notification } from '../../models/notification.model';
// import { PopoverModule } from 'primeng/popover';
// import { TabsModule } from 'primeng/tabs';
// import { Popover } from 'primeng/popover';

// @Component({
//   selector: 'app-navigation',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     PopoverModule,
//     TabsModule,
//     ButtonModule,
//     RippleModule,
//     TooltipModule,
//     ConfirmDialog,
//     ToastModule,
//   ],
//   templateUrl: './navigation.component.html',
//   styleUrls: ['./navigation.component.css'],
//   providers: [ConfirmationService, MessageService],
//   animations: [
//     trigger('fadeInOut', [
//       transition(':enter', [
//         style({ opacity: 0 }),
//         animate('300ms ease-out', style({ opacity: 1 }))
//       ]),
//       transition(':leave', [
//         animate('200ms ease-in', style({ opacity: 0 }))
//       ])
//     ]),
//     trigger('listAnimation', [
//       transition(':enter', [
//         style({ 
//           opacity: 0, 
//           transform: 'translateY(10px)'
//         }),
//         animate('{{delay}}ms ease-out', style({ 
//           opacity: 1, 
//           transform: 'translateY(0)'
//         }))
//       ])
//     ]),
//     trigger('tabContentAnimation', [
//       transition('* <=> *', [
//         style({ opacity: 0, transform: 'translateY(5px)' }),
//         animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
//       ])
//     ]),
//     trigger('badgePulse', [
//       state('pulse', style({ transform: 'scale(1.2)' })),
//       state('normal', style({ transform: 'scale(1)' })),
//       transition('normal <=> pulse', animate('300ms ease-in-out'))
//     ])
//   ]
// })
// export class NavigationComponent implements OnInit {
//   isHandset$: Observable<boolean>;
//   isTablet$: Observable<boolean>;
//   userData: any = null;
//   sidebarVisible: boolean = true;
//   isMobile: boolean = false;

//   // Notification Data
//   notificationCount: number = 0;
//   notifications: Notification[] = [];
//   showNotifications: boolean = false;
//   loadingNotifications: boolean = true; 
//   activeTab: string = 'lowstock';
//   badgeState: string = 'normal';
//   @ViewChild('notificationButton') notificationButton: any;
//   @ViewChild('pop') pop: Popover | undefined;
//   new: any;

//   constructor(
//     private breakpointObserver: BreakpointObserver,
//     private authService: AuthService,
//     private router: Router,
//     private confirmationService: ConfirmationService,
//     private messageService: MessageService,
//     private notificationService: NotificationService,
//     private cdr: ChangeDetectorRef
//   ) {
//     this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
//       map((result) => result.matches),
//       shareReplay()
//     );

//     this.isTablet$ = this.breakpointObserver
//       .observe([Breakpoints.TabletPortrait, Breakpoints.TabletLandscape])
//       .pipe(
//         map((result) => result.matches),
//         shareReplay()
//       );

//     this.isHandset$.subscribe((isHandset) => {
//       if (isHandset) {
//         this.isMobile = true;
//         if (
//           this.sidebarVisible === true &&
//           !localStorage.getItem('sidebarVisible')
//         ) {
//           this.sidebarVisible = false;
//         }
//       }
//     });

//     this.isTablet$.subscribe((isTablet) => {
//       if (isTablet && !this.isMobile) {
//         this.isMobile = true;
//         if (
//           this.sidebarVisible === true &&
//           !localStorage.getItem('sidebarVisible')
//         ) {
//           this.sidebarVisible = false;
//         }
//       } else if (!isTablet && !this.isMobile) {
//         this.isMobile = false;
//         this.sidebarVisible = true;
//       }
//     });
//   }

//   ngOnInit() {
//     this.loadUserData();
//     this.startBadgeAnimation();
//     const savedSidebarState = localStorage.getItem('sidebarVisible');
//     if (savedSidebarState) {
//       this.sidebarVisible = savedSidebarState === 'true';
//     }
//   }

//   startBadgeAnimation() {
//     // Start badge pulse animation at intervals
//     setInterval(() => {
//       if (this.notificationCount > 0) {
//         this.badgeState = this.badgeState === 'normal' ? 'pulse' : 'normal';
//         this.cdr.detectChanges();
//       }
//     }, 3000);
//   }

//   toggleNotifications(event: Event) {
//     // Ensure we're correctly toggling the popover
//     if (this.pop) {
//       this.pop.toggle(event, this.notificationButton.nativeElement);
//       // We should load notifications here to ensure fresh data
//       this.loadNotifications();
//     }
//   }

//   loadNotifications() {
//     this.loadingNotifications = true;
//     this.notificationService.getNotification().subscribe(
//       (response) => {
//         console.log('API Response:', response);
//         if (response.success && Array.isArray(response.data)) {
//           this.notifications = response.data;
//           this.notificationCount = this.notifications.length;
//         } else {
//           this.notifications = [];
//           this.notificationCount = 0;
//         }
//         this.loadingNotifications = false;
//         this.cdr.detectChanges(); // Force change detection
//       },
//       (error) => {
//         console.error('Error fetching notifications:', error);
//         this.loadingNotifications = false;
//         this.cdr.detectChanges(); // Force change detection
//       }
//     );
//   }

//   loadUserData() {
//     this.authService.validateToken().subscribe({
//       next: (response) => {
//         this.userData = response.data;
//         this.userData.profilePicture = `${environment.imageUrl}${this.userData.profilePicture}`;
//       },
//       error: () => {
//         this.logout();
//       },
//     });
//   }

//   toggleSidebar() {
//     this.sidebarVisible = !this.sidebarVisible;
//     localStorage.setItem('sidebarVisible', this.sidebarVisible.toString());
//   }

//   closeSidebar() {
//     if (this.isMobile) {
//       this.sidebarVisible = false;
//       localStorage.setItem('sidebarVisible', this.sidebarVisible.toString());
//     }
//   }

//   openUserProfile() {
//     this.router.navigate(['/dashboard/userProfile']);
//   }

//   logout() {
//     this.authService.logout();
//     window.location.href = '/login';
//   }

//   confirm1(event: Event) {
//     this.confirmationService.confirm({
//       target: event.target as EventTarget,
//       message: 'Are you sure want to Log Out?',
//       header: 'Confirmation',
//       closable: true,
//       closeOnEscape: true,
//       icon: 'pi pi-exclamation-triangle',
//       rejectButtonProps: {
//         label: 'Cancel',
//         severity: 'secondary',
//         outlined: true,
//       },
//       acceptButtonProps: {
//         label: 'Logout',
//       },
//       accept: () => {
//         this.logout();
//       },
//       reject: () => {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Rejected',
//           detail: 'You have rejected',
//           life: 3000,
//         });
//       },
//     });
//   }

//   navigateToDashboard() {
//     this.router.navigate(['/dashboard']);
//   }
  
//   viewAllNotifications() {
//     // Navigate to notifications page
//     this.router.navigate(['/dashboard/notifications']);
//     // Close the popover
//     if (this.pop) {
//       this.pop.hide();
//     }
//   }
  
//   // Method to check if there are notifications for the active tab
//   hasNotificationsForTab(tabName: string): boolean {
//     return this.notifications.some(notification => 
//       notification.messageType === tabName && !notification.expiryDate
//     && new Date(notification.expiryDate) > new Date()
//     );
//   }
  
//   // Method to get only notifications for the current active tab
//   getFilteredNotifications(): Notification[] {
//     return this.notifications.filter(notification => 
//       notification.messageType === this.activeTab
//     && !notification.expiryDate
//     );
//   }
  
//   // Handle tab change
//   onTabChange(tabName: string) {
//     this.activeTab = tabName;
//     this.cdr.detectChanges();
//   }
// }


import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../services/login.service';
import { environment } from '../../../environments/environment';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';
import { PopoverModule } from 'primeng/popover';
import { TabsModule } from 'primeng/tabs';
import { Popover } from 'primeng/popover';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PopoverModule,
    TabsModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    ConfirmDialog,
    ToastModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  providers: [ConfirmationService, MessageService],
  // animations: [
  //       trigger('fadeInOut', [
  //         transition(':enter', [
  //           style({ opacity: 0 }),
  //           animate('300ms ease-out', style({ opacity: 1 }))
  //         ]),
  //         transition(':leave', [
  //           animate('200ms ease-in', style({ opacity: 0 }))
  //         ])
  //       ]),
  //       trigger('listAnimation', [
  //         transition(':enter', [
  //           style({ 
  //             opacity: 0, 
  //             transform: 'translateY(10px)'
  //           }),
  //           animate('{{delay}}ms ease-out', style({ 
  //             opacity: 1, 
  //             transform: 'translateY(0)'
  //           }))
  //         ])
  //       ]),
  //       trigger('tabContentAnimation', [
  //         transition('* <=> *', [
  //           style({ opacity: 0, transform: 'translateY(5px)' }),
  //           animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  //         ])
  //       ]),
  //       trigger('badgePulse', [
  //         state('pulse', style({ transform: 'scale(1.2)' })),
  //         state('normal', style({ transform: 'scale(1)' })),
  //         transition('normal <=> pulse', animate('300ms ease-in-out'))
  //       ])
  //     ]
})
export class NavigationComponent implements OnInit {
  isHandset$: Observable<boolean>;
  isTablet$: Observable<boolean>;
  userData: any = null;
  sidebarVisible: boolean = true;
  isMobile: boolean = false;

  // Notification Data
  notificationCount: number = 0;
  notifications: Notification[] = [];
  showNotifications: boolean = false;
  loadingNotifications: boolean = true; 
  activeTab: string = 'lowstock';
  @ViewChild('notificationButton') notificationButton: any;
  @ViewChild('pop') pop: Popover | undefined;
new: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay()
    );

    this.isTablet$ = this.breakpointObserver
      .observe([Breakpoints.TabletPortrait, Breakpoints.TabletLandscape])
      .pipe(
        map((result) => result.matches),
        shareReplay()
      );

    this.isHandset$.subscribe((isHandset) => {
      if (isHandset) {
        this.isMobile = true;
        if (
          this.sidebarVisible === true &&
          !localStorage.getItem('sidebarVisible')
        ) {
          this.sidebarVisible = false;
        }
      }
    });

    this.isTablet$.subscribe((isTablet) => {
      if (isTablet && !this.isMobile) {
        this.isMobile = true;
        if (
          this.sidebarVisible === true &&
          !localStorage.getItem('sidebarVisible')
        ) {
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
    this.loadNotifications();
    const savedSidebarState = localStorage.getItem('sidebarVisible');
    if (savedSidebarState) {
      this.sidebarVisible = savedSidebarState === 'true';
    }
  }

// In the toggleNotifications method:
toggleNotifications(event: Event) {
  // Ensure we're correctly toggling the popover
  if (this.pop) {
    this.pop.toggle(event, this.notificationButton.nativeElement);
    // We should load notifications here to ensure fresh data
    this.loadNotifications();
  }
}

loadNotifications() {
  this.loadingNotifications = true;
  this.notificationService.getNotification().subscribe(
    (response) => {
      console.log('API Response:', response);
      if (response.success && Array.isArray(response.data)) {
        this.notifications = response.data;
        this.notificationCount = this.notifications.length;
      } else {
        this.notifications = [];
        this.notificationCount = 0;
      }
      this.loadingNotifications = false;
      this.cdr.detectChanges(); // Force change detection
    },
    (error) => {
      console.error('Error fetching notifications:', error);
      this.loadingNotifications = false;
      this.cdr.detectChanges(); // Force change detection
    }
  );
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
    localStorage.setItem('sidebarVisible', this.sidebarVisible.toString());
  }

  closeSidebar() {
    if (this.isMobile) {
      this.sidebarVisible = false;
      localStorage.setItem('sidebarVisible', this.sidebarVisible.toString());
    }
  }

  openUserProfile() {
    this.router.navigate(['/dashboard/userProfile']);
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }

  confirm1(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure want to Log Out?',
      header: 'Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Logout',
      },
      accept: () => {
        this.logout();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}