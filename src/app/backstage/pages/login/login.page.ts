import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import { Router } from '@angular/router'
import { InputTextModule } from 'primeng/inputtext'
import { PasswordModule } from 'primeng/password'
import { ButtonModule } from 'primeng/button'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="login-bg">
      <p-toast position="top-center"></p-toast>
      <div class="glass-card">
        <div class="login-logo">
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="28" cy="28" r="28" fill="white" fill-opacity="0.15" />
            <path
              d="M16 32C20 28 36 28 40 32"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
            />
            <path
              d="M20 24C23 21 33 21 36 24"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
            />
            <path
              d="M24 16C25.5 15 30.5 15 32 16"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <h2 class="login-title">Welcome Back</h2>
        <div class="login-subtitle">
          Don't have an account?
          <a class="signup-link" href="#">Sign up</a>
        </div>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="input-group">
            <span class="input-icon pi pi-user"></span>
            <input
              id="username"
              type="text"
              pInputText
              formControlName="username"
              placeholder="Username"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('username') }"
              autocomplete="username"
            />
          </div>
          <div class="input-group">
            <span class="input-icon pi pi-lock"></span>
            <input
              id="password"
              type="password"
              pInputText
              formControlName="password"
              placeholder="Password"
              [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('password') }"
              autocomplete="current-password"
            />
          </div>
          <button
            pButton
            type="submit"
            class="login-btn"
            [loading]="loading"
            [disabled]="loginForm.invalid"
            label="Sign In"
          ></button>
        </form>
        <a class="forgot-link" href="#">Forgot Password?</a>
      </div>
    </div>
  `,
  styles: [
    `
      .login-bg {
        min-height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        background:
          radial-gradient(ellipse 80% 80% at 60% 20%, #a259e6 0%, #3b2667 40%, #232946 100%),
          radial-gradient(ellipse 60% 60% at 20% 80%, #5bc0eb 0%, #3b2667 60%, #232946 100%);
        background-blend-mode: screen;
        overflow: auto;
      }
      .glass-card {
        width: 420px;
        max-width: 95vw;
        background: rgba(255, 255, 255, 0.13);
        border-radius: 24px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1.5px solid rgba(255, 255, 255, 0.18);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 3rem 2.5rem 2.5rem 2.5rem;
        margin: 2rem 0;
      }
      .login-logo {
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .login-title {
        color: #fff;
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        text-align: center;
        letter-spacing: 0.01em;
      }
      .login-subtitle {
        color: #e0e0e0;
        font-size: 1rem;
        margin-bottom: 2.2rem;
        text-align: center;
      }
      .signup-link {
        color: #fff;
        text-decoration: underline;
        margin-left: 0.3em;
        font-weight: 500;
        transition: color 0.2s;
      }
      .signup-link:hover {
        color: #a259e6;
      }
      .login-form {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        margin-bottom: 1.5rem;
      }
      .input-group {
        position: relative;
        width: 100%;
      }
      .input-icon {
        position: absolute;
        left: 1.2rem;
        top: 50%;
        transform: translateY(-50%);
        color: #bdbdbd;
        font-size: 1.2rem;
        z-index: 2;
      }
      input[pInputText] {
        width: 100%;
        padding: 0.9rem 1.2rem 0.9rem 3.2rem;
        border-radius: 2rem;
        border: none;
        outline: none;
        background: rgba(255, 255, 255, 0.18);
        color: #fff;
        font-size: 1.08rem;
        font-weight: 500;
        box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.05);
        transition:
          background 0.2s,
          box-shadow 0.2s;
      }
      input[pInputText]:focus {
        background: rgba(255, 255, 255, 0.28);
        box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.1);
      }
      .login-btn {
        width: 100%;
        border-radius: 2rem !important;
        background: #11131a !important;
        color: #fff !important;
        font-size: 1.15rem !important;
        font-weight: 600 !important;
        padding: 0.95rem 0 !important;
        margin-top: 0.5rem;
        border: none !important;
        box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.1);
        transition:
          background 0.2s,
          box-shadow 0.2s;
      }
      .login-btn:hover:not(:disabled) {
        background: #22243a !important;
        box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.18);
      }
      .forgot-link {
        color: #e0e0e0;
        font-size: 1rem;
        text-align: center;
        margin-top: 0.5rem;
        text-decoration: underline;
        transition: color 0.2s;
        display: block;
      }
      .forgot-link:hover {
        color: #a259e6;
      }
      @media (max-width: 600px) {
        .glass-card {
          padding: 2rem 0.7rem 1.5rem 0.7rem;
        }
        .login-title {
          font-size: 1.3rem;
        }
      }
    `
  ]
})
export class LoginPage {
  loginForm: FormGroup
  loading = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.loginForm.get(field)
    return formControl ? formControl.invalid && (formControl.dirty || formControl.touched) : false
  }

  getErrorMessage(field: string): string {
    const formControl = this.loginForm.get(field)
    if (!formControl) return ''
    if (formControl.hasError('required')) {
      return 'This field is required.'
    }
    if (formControl.hasError('minlength')) {
      return field === 'username'
        ? 'Username must be at least 3 characters.'
        : 'Password must be at least 6 characters.'
    }
    return ''
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true
      // TODO: Implement real login logic
      setTimeout(() => {
        this.loading = false
        this.messageService.add({
          severity: 'success',
          summary: 'Login Success',
          detail: 'Redirecting to dashboard...'
        })
        this.router.navigate(['/backstage/dashboard'])
      }, 1000)
    }
  }
}
