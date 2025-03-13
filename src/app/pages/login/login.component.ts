import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/login.service';
import { UserService } from '../../services/user.services';

@Component({
  selector: 'app-login',
  imports: [
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [AuthService, UserService],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  resetSent = false;
  errorMessage: string = '';
  resetEmail: '' | undefined;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    const loginData = this.loginForm.value;
    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (loginData.rememberMe) {
          localStorage.setItem('token', response.accessToken);
        } else {
          sessionStorage.setItem('token', response.accessToken);
        }

        this.router.navigate(['/dashboard/home']);
        console.log('Login successful!', response);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Invalid email or password';
        console.log('Login error:', err);
      },
    });
  }

  sendResetLink(): void {
    if (!this.loginForm.value.email) {
      this.errorMessage = 'Please enter your email to send a reset link';
      return;
    }

    this.userService
      .sendResetPasswordEmail(this.loginForm.value.email)
      .subscribe({
        next: (response) => {
          this.resetSent = true;
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Reset link error:', error);
          this.errorMessage =
            error.error.message || 'Failed to send reset link';
        },
      });
  }

  get f() {
    return this.loginForm.controls;
  }
}