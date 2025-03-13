import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/user.services';
import { AuthService } from '../../services/login.service';
import { environment } from '../../../environments/environment';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { ChipModule } from 'primeng/chip';
import { Subscription } from 'rxjs';
import {
  SnackbarConfig,
  SnackbarService,
} from '../../services/snackbar.service';
import { SnackbarComponent } from '../../layout/component/snackbar/snackbar.component';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { CalendarIcon } from 'primeng/icons';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    ChipModule,
    SnackbarComponent,
    DatePickerModule,
    
  ],
  providers: [MessageService],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userData: any = null;
  originalUserData: any = null;
  editMode: boolean = false;
  showChangePasswordDialog: boolean = false;
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isSubmitted: boolean = false;
  isOldPasswordIncorrect: boolean = false;
  snackbarConfig: SnackbarConfig = {
    type: 'success',
    title: '',
    message: '',
    duration: 3000,
  };
  today: Date = new Date();

  snackbarVisible: boolean = false;
  private snackbarSubscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.snackbarSubscriptions.push(
      this.snackbarService.visible$.subscribe(
        (visible) => (this.snackbarVisible = visible)
      ),
      this.snackbarService.config$.subscribe(
        (config) => (this.snackbarConfig = config)
      )
    );
  }

  ngOnDestroy(): void {
    this.snackbarSubscriptions.forEach((sub) => sub.unsubscribe());
    this.snackbarService.hideSnackbar();
  }

  loadUserData() {
    this.authService.validateToken().subscribe({
      next: (response) => {
        if (response?.data) {
          this.userData = { ...response.data };
          this.originalUserData = { ...response.data };
          this.userData.profilePicture = response.data.profilePicture
            ? `${environment.imageUrl}${response.data.profilePicture}`
            : 'assets/default-profile.png';
          this.userData.dateOfBirth = new Date(this.userData.dateOfBirth);
        }
      },
      error: (err) => {
        console.error('Failed to load user data', err);
        this.snackbarService.showError('Error', 'Failed to load user data');
      },
    });
  }

  toggleEditMode() {
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
    this.userData = { ...this.originalUserData };
    if (
      this.userData.profilePicture &&
      this.userData.profilePicture.startsWith(environment.imageUrl)
    ) {
      this.userData.profilePicture = this.userData.profilePicture.replace(
        environment.imageUrl,
        ''
      );
    }
    this.loadUserData();
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.userData.profilePicture = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile(form: NgForm) {
    if (!form.valid) {
      this.snackbarService.showError(
        'Invalid Form',
        'Please fill all required fields correctly'
      );
      return;
    }

    const updatedData = {
      ...this.userData,
      profilePicture: this.userData.profilePicture.startsWith('data:')
        ? this.userData.profilePicture
        : undefined,
    };

    // this.userService.updateUser(this.userData._id, updatedData).subscribe({
    //   next: (response) => {
    //     this.editMode = false;
    //     this.originalUserData = { ...this.userData };
    //     this.snackbarService.showSuccess(
    //       'Profile Updated',
    //       'Your profile has been updated successfully'
    //     );
    //   },
    //   error: (err) => {
    //     console.error('Failed to update profile', err);
    //     this.snackbarService.showError('Error', 'Failed to update profile');
    //   },
    // });
  }

  openChangePasswordDialog() {
    this.showChangePasswordDialog = true;
    this.resetPasswordFields();
  }

  validateAndChangePassword() {
    this.isSubmitted = true;

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      return;
    }

    this.processPasswordChange();
  }

  processPasswordChange() {
    if (this.newPassword.length < 6) {
      this.snackbarService.showError(
        'Weak Password',
        'Password must be at least 6 characters long.'
      );
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.snackbarService.showError(
        'Password Mismatch',
        'New password and confirm password do not match.'
      );
      return;
    }

    this.changePassword();
  }

  changePassword(): void {
    const userId = this.userData?._id;
    if (!userId) {
      this.snackbarService.showError('Error', 'User ID is missing.');
      return;
    }

    this.userService
      .changePassword(
        userId,
        this.oldPassword,
        this.newPassword,
        this.confirmPassword
      )
      .subscribe({
        next: () => {
          this.showChangePasswordDialog = false;
          this.resetPasswordFields();
          this.snackbarService.showSuccess(
            'Password Changed',
            'Your password has been updated successfully!'
          );
        },
        error: (error) => {
          console.error('Error changing password:', error);
          if (error.error?.message === 'Please enter valid old password') {
            this.isOldPasswordIncorrect = true;
          } else {
            this.snackbarService.showError(
              'Error',
              error.error?.message || 'Something went wrong. Please try again.'
            );
          }
        },
      });
  }

  closeDialog() {
    console.log('this.userData');
    this.showChangePasswordDialog = false;
    this.resetPasswordFields();
  }

  private resetPasswordFields() {
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.isSubmitted = false;
    this.isOldPasswordIncorrect = false;
  }
}
