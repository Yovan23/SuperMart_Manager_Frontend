import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.services';
import { AuthService } from '../../services/login.service';
import { environment } from '../../../environments/environment';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SnackbarConfig, SnackbarService } from '../../services/snackbar.service';
import { SnackbarComponent } from '../../layout/component/snackbar/snackbar.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    SnackbarComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userData: any = null;
  showChangePasswordDialog: boolean = false;
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isSubmitted: boolean = false;
  snackbarConfig: SnackbarConfig = {
    type: 'success',
    title: '',
    message: '',
    duration: 3000,
  };
  private snackbarSubscriptions: Subscription[] = [];
snackbarVisible: any;
isOldPasswordIncorrect: any;

  constructor(
    private userService: UserService,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.snackbarSubscriptions.push(
      this.snackbarService.visible$.subscribe(
          visible => this.snackbarVisible = visible
      )
  );

  this.snackbarSubscriptions.push(
      this.snackbarService.config$.subscribe(
          config => this.snackbarConfig = config
      )
  );
}
ngOnDestroy(): void {
  this.snackbarSubscriptions.forEach(sub => sub.unsubscribe());
  this.snackbarService.hideSnackbar();
}

  loadUserData() {
    this.authService.validateToken().subscribe({
      next: (response) => {
        if (response?.data) {
          this.userData = response.data;
          this.userData.profilePicture = response.data.profilePicture
            ? `${environment.imageUrl}${response.data.profilePicture}`
            : 'assets/default-profile.png'; 
        }
      },
      error: (err) => {
        console.error('Failed to load user data', err);
      }
    });
  }

  openChangePasswordDialog() {
    this.showChangePasswordDialog = true;
    this.resetPasswordFields();
  }

  /**
   * Validates and triggers password change
   */
  validateAndChangePassword() {
    this.isSubmitted = true;

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      return;
    }

    this.processPasswordChange();
  }

  /**
   * Validates new password and calls API to change it
   */
  processPasswordChange() {
    if (this.newPassword.length < 6) {
      this.snackbarService.showError('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.snackbarService.showError('Password Mismatch', 'New password and confirm password do not match.');
      return;
    }

    this.changePassword();
  }

  /**
   * Calls API to change password
   */
  changePassword(): void {
    const userId = this.userData?._id;
  
    if (!userId) {
      this.snackbarService.showError('Error', 'User ID is missing.');
      return;
    }
    this.userService.changePassword(userId, this.oldPassword, this.newPassword, this.confirmPassword).subscribe({
      next: (response: any) => {        
        this.showChangePasswordDialog = false;
        this.resetPasswordFields(); 
        this.snackbarService.showSuccess('Password Changed', 'Your password has been updated successfully!');
      },
      error: (error) => {
        console.error('Error changing password:', error);
        if (error.error?.message === 'Please enter valid old password') {
          this.showChangePasswordDialog = false;
          this.snackbarService.showError('Incorrect Password', 'The old password entered is incorrect.');
        } else {
          this.snackbarService.showError('Error', error.error?.message || 'Something went wrong. Please try again.');
        }
      }
    });
  }
  
  closeDialog() {
    this.showChangePasswordDialog = false;
    this.resetPasswordFields();
  }
  private resetPasswordFields() {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.isSubmitted = false;
  }
}
